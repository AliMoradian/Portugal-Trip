const fs = require('fs');
const path = require('path');

const typesFile = path.join(__dirname, 'src', 'types.ts');
let content = fs.readFileSync(typesFile, 'utf8');

// Regex to match the thumb URLs
// Example: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aeroporto_Francisco_S%C3%A1_Carneiro_%28Porto%29.jpg/800px-Aeroporto_Francisco_S%C3%A1_Carneiro_%28Porto%29.jpg
const regex = /https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[a-f0-9]\/[a-f0-9]{2}\/([^\/]+)\/\d+px-[^"]+/g;

content = content.replace(regex, (match, filename) => {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=800`;
});

// Also fix any non-thumb URLs just in case
const regex2 = /https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[a-f0-9]\/[a-f0-9]{2}\/([^"]+)/g;
content = content.replace(regex2, (match, filename) => {
  if (match.includes('thumb/')) return match; // Already handled
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=800`;
});

fs.writeFileSync(typesFile, content, 'utf8');
console.log('Fixed URLs in types.ts');

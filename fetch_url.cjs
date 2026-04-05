const https = require('https');

function getImageUrl(filename) {
  const options = {
    hostname: 'en.wikipedia.org',
    path: `/w/api.php?action=query&titles=${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`,
    headers: { 'User-Agent': 'AIStudioBot/1.0 (moradian.ali@gmail.com)' }
  };

  https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const pages = json.query.pages;
        const pageId = Object.keys(pages)[0];
        const url = pages[pageId].imageinfo[0].url;
        console.log(url);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    });
  });
}

getImageUrl('File:Obidos April 2009-4b.jpg');

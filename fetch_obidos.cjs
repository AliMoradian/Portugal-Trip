const https = require('https');

function fetchImages(title) {
  const options = {
    hostname: 'en.wikipedia.org',
    path: `/w/api.php?action=query&prop=images&titles=${encodeURIComponent(title)}&format=json`,
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
        const images = pages[pageId].images;
        if (images) {
          images.forEach(img => {
            if (img.title.endsWith('.jpg') || img.title.endsWith('.JPG')) {
              console.log(img.title);
            }
          });
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    });
  });
}

fetchImages('Óbidos, Portugal');

// rss-to-json.js
const fetch = require('node-fetch');
const fs = require('fs');
const { JSDOM } = require('jsdom');

const rssUrl = 'https://cba.media/podcast/5minutenclimatechance/feed';

fetch(rssUrl)
  .then(res => res.text())
  .then(str => {
    const dom = new JSDOM(str, { contentType: 'text/xml' });
    const xml = dom.window.document;
    const items = xml.querySelectorAll('item');

    const episodes = Array.from(items).map(item => ({
      title: item.querySelector('title')?.textContent || 'Untitled',
      link: item.querySelector('link')?.textContent || '#',
      description: item.querySelector('description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || '',
      author: item.querySelector('dc\\:creator')?.textContent || '',
      categories: Array.from(item.querySelectorAll('category')).map(c => c.textContent),
      guid: item.querySelector('guid')?.textContent || '',
      audio: item.querySelector('enclosure')?.getAttribute('url') || '',
      duration: item.querySelector('itunes\\:duration')?.textContent || ''
    }));

    fs.writeFileSync('js/episodes.json', JSON.stringify(episodes, null, 2));
    console.log('episodes.json created!');
  })
  .catch(console.error);

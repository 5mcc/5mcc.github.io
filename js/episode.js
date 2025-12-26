// episode.js
const feedUrl = 'https://cba.media/podcast/5minutenclimatechance/feed';

// Get GUID from URL
function getGUID() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Format date nicely
function formatDate(pubDate) {
    const d = new Date(pubDate);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function loadEpisode() {
    const container = document.getElementById('episode-container');
    const guid = getGUID();
    if (!container || !guid) return;

    try {
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error('RSS feed konnte nicht geladen werden');
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const items = Array.from(xml.querySelectorAll('item'));
        const epXml = items.find(item => item.querySelector('guid')?.textContent === guid);
        if (!epXml) {
            container.innerHTML = 'Episode nicht gefunden.';
            return;
        }

        const ep = {
            title: epXml.querySelector('title')?.textContent || '',
            description: epXml.querySelector('description')?.textContent || '',
            author: epXml.querySelector('dc\\:creator')?.textContent || '',
            pubDate: epXml.querySelector('pubDate')?.textContent || '',
            categories: Array.from(epXml.querySelectorAll('category')).map(c => c.textContent),
            audio: epXml.querySelector('enclosure')?.getAttribute('url') || '',
            image: epXml.querySelector('itunes\\:image')?.getAttribute('href') || ''
        };

        container.innerHTML = `
            <h1>${ep.title}</h1>
            <p class="date">${formatDate(ep.pubDate)}</p>
            <p><strong>Author:</strong> ${ep.author}</p>
            <p><strong>Categories:</strong> ${ep.categories.join(', ')}</p>
            ${ep.image ? `<img src="${ep.image}" alt="${ep.title}" style="max-width:300px">` : ''}
            <div>${ep.description}</div>
            ${ep.audio ? `<audio controls src="${ep.audio}"></audio>` : ''}
        `;
    } catch (err) {
        console.error(err);
        container.innerHTML = 'Episode konnte leider nicht geladen werden.';
    }
}

document.addEventListener('DOMContentLoaded', loadEpisode);

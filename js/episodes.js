const rssFeedUrl = 'https://cba.media/podcast/5minutenclimatechance/feed';
const episodesContainer = document.querySelector('#episodes-container');

let allEpisodes = [];
let currentIndex = 0;
const batchSize = 10; // show 10 episodes at a time

function createEpisodeHTML(episode) {
    return `
    <article class="episode">
        <h3>${episode.title}</h3>
        <p class="de">${episode.description}</p>
        <p class="listen">
            <a href="${episode.link}" target="_blank">▶ Auf CBA anhören</a>
        </p>
    </article>
    `;
}

// Load next batch
function showMoreEpisodes() {
    const nextBatch = allEpisodes.slice(currentIndex, currentIndex + batchSize);
    nextBatch.forEach(ep => {
        episodesContainer.insertAdjacentHTML('beforeend', createEpisodeHTML(ep));
    });
    currentIndex += batchSize;

    // Hide button if all episodes are loaded
    if (currentIndex >= allEpisodes.length) {
        document.querySelector('#show-more-btn').style.display = 'none';
    }
}

// Fetch RSS
fetch(rssFeedUrl)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        const items = data.querySelectorAll('item');
        allEpisodes = Array.from(items).map(item => ({
            title: item.querySelector('title').textContent,
            link: item.querySelector('link').textContent,
            description: item.querySelector('description').textContent
        }));
        showMoreEpisodes();
    })
    .catch(err => {
        episodesContainer.innerHTML = 'Episodes konnten leider nicht geladen werden.';
        console.error(err);
    });

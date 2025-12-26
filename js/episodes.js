const episodesContainer = document.querySelector('#episodes-container');

let allEpisodes = [];
let currentIndex = 0;
const batchSize = 10;

// Generate HTML for a single episode
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

// Show next batch of episodes
function showMoreEpisodes() {
    const nextBatch = allEpisodes.slice(currentIndex, currentIndex + batchSize);
    nextBatch.forEach(ep => {
        episodesContainer.insertAdjacentHTML('beforeend', createEpisodeHTML(ep));
    });
    currentIndex += batchSize;

    if (currentIndex >= allEpisodes.length) {
        document.querySelector('#show-more-btn').style.display = 'none';
    }
}

// Fetch JSON instead of RSS
fetch('js/episodes.json')
    .then(res => res.json())
    .then(data => {
        allEpisodes = data;
        showMoreEpisodes();
    })
    .catch(err => {
        episodesContainer.innerHTML = 'Episodes konnten leider nicht geladen werden.';
        console.error(err);
    });

const RSS_URL = "https://cba.media/podcast/5minutenclimatechance/feed";
const episodesContainer = document.getElementById("episodes-list");
const showMoreBtn = document.getElementById("show-more");

let allEpisodes = [];
let shownCount = 0;
const STEP = 10;

// Simple function to fetch RSS and convert to JSON
async function fetchEpisodes() {
  try {
    const response = await fetch(RSS_URL);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const items = xml.querySelectorAll("item");
    
    allEpisodes = Array.from(items).map(item => {
      return {
        title: item.querySelector("title")?.textContent || "",
        link: item.querySelector("link")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || "",
        description: item.querySelector("description")?.textContent || "",
        guid: item.querySelector("guid")?.textContent || ""
      };
    });

    showEpisodes();
  } catch (err) {
    episodesContainer.innerHTML = "Episodes konnten leider nicht geladen werden.";
    console.error(err);
  }
}

// Show episodes in chunks
function showEpisodes() {
  const slice = allEpisodes.slice(shownCount, shownCount + STEP);
  slice.forEach(ep => {
    const el = document.createElement("article");
    el.classList.add("episode");
    el.innerHTML = `
      <h3>${ep.title}</h3>
      <p>${ep.description}</p>
      <p class="listen"><a href="episode.html?id=${encodeURIComponent(ep.guid)}">▶ Mehr erfahren / Listen</a></p>
    `;
    episodesContainer.appendChild(el);
  });

  shownCount += STEP;
  if (shownCount < allEpisodes.length) {
    showMoreBtn.style.display = "block";
  } else {
    showMoreBtn.style.display = "none";
  }
}

// Show more button
showMoreBtn.addEventListener("click", showEpisodes);

// Start fetching
fetchEpisodes();

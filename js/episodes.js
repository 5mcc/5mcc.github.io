const container = document.getElementById("episodes-list");
const showMoreBtn = document.getElementById("show-more");

let visibleCount = 10;

fetch("/episodes.json")
  .then(res => {
    if (!res.ok) throw new Error("JSON missing");
    return res.json();
  })
  .then(episodes => {
    renderEpisodes(episodes);
    if (episodes.length > visibleCount) {
      showMoreBtn.style.display = "inline-block";
      showMoreBtn.addEventListener("click", () => {
        visibleCount += 10;
        renderEpisodes(episodes);
      });
    }
  })
  .catch(err => {
    console.error(err);
    container.textContent =
      "Episodes konnten leider nicht geladen werden.";
  });

function renderEpisodes(episodes) {
  container.innerHTML = "";

  episodes.slice(0, visibleCount).forEach(ep => {
    const article = document.createElement("article");
    article.className = "episode-item";

    const date = ep.published
      ? new Date(ep.published).toLocaleDateString("de-DE", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      : "";

    article.innerHTML = `
      <h2>${escapeHTML(ep.title)}</h2>

      ${date ? `<p class="episode-date">${date}</p>` : ""}

      <p>
        <a href="episode.html?id=${encodeURIComponent(ep.id)}">
          Zur Episode
        </a>
      </p>
    `;

    container.appendChild(article);
  });
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

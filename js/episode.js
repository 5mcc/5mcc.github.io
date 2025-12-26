(function () {
  const container = document.getElementById("episode-detail");

  if (!container) return;

  // Read ?id=... from URL
  const params = new URLSearchParams(window.location.search);
  const episodeId = params.get("id");

  if (!episodeId) {
    container.textContent = "Keine Episode angegeben.";
    return;
  }

  fetch("/episodes.json")
    .then(res => {
      if (!res.ok) throw new Error("episodes.json not found");
      return res.json();
    })
    .then(episodes => {
      const episode = episodes.find(e => e.id === episodeId);

      if (!episode) {
        container.textContent = "Episode nicht gefunden.";
        return;
      }

      renderEpisode(episode);
    })
    .catch(err => {
      console.error(err);
      container.textContent =
        "Episode konnte leider nicht geladen werden.";
    });

  function renderEpisode(ep) {
    document.title = `${ep.title} – 5MinutenClimateChance`;

    const date = ep.published
      ? new Date(ep.published).toLocaleDateString("de-DE", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      : "";

    container.innerHTML = `
      <article class="episode">
        <h1>${escapeHTML(ep.title)}</h1>

        ${date ? `<p class="episode-date">${date}</p>` : ""}

        ${ep.audio ? `
          <audio controls preload="none">
            <source src="${ep.audio}" type="audio/mpeg">
            Dein Browser unterstützt kein Audio-Element.
          </audio>
        ` : ""}

        <div class="episode-description">
          ${ep.description || ""}
        </div>

        ${ep.link ? `
          <p class="episode-link">
            <a href="${ep.link}" target="_blank" rel="noopener">
              Episode auf cba.media anhören
            </a>
          </p>
        ` : ""}
      </article>
    `;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();

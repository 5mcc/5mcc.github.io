const RSS_URL = "https://cba.media/podcast/5minutenclimatechance/feed";
const detailContainer = document.getElementById("episode-detail");

const urlParams = new URLSearchParams(window.location.search);
const guid = urlParams.get("id");

async function fetchEpisode() {
  try {
    const response = await fetch(RSS_URL);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const item = Array.from(xml.querySelectorAll("item")).find(i => i.querySelector("guid")?.textContent === guid);

    if (!item) {
      detailContainer.innerHTML = "Episode nicht gefunden.";
      return;
    }

    const ep = {
      title: item.querySelector("title")?.textContent || "",
      description: item.querySelector("description")?.textContent || "",
      pubDate: item.querySelector("pubDate")?.textContent || "",
      link: item.querySelector("link")?.textContent || ""
    };

    detailContainer.innerHTML = `
      <h2>${ep.title}</h2>
      <p><em>${ep.pubDate}</em></p>
      <p>${ep.description}</p>
      <p><a href="${ep.link}">▶ Auf CBA anhören / Listen on CBA</a></p>
    `;
  } catch (err) {
    detailContainer.innerHTML = "Episode konnte leider nicht geladen werden.";
    console.error(err);
  }
}

fetchEpisode();

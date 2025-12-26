document.addEventListener("DOMContentLoaded", () => {
    const FEED_URL = "https://cba.media/podcast/5minutenclimatechance/feed";
    const container = document.getElementById("episodes");

    if (!container) return;

    fetch(FEED_URL)
        .then(response => response.text())
        .then(xmlText => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "application/xml");
            const items = Array.from(xml.querySelectorAll("item"));

            const episodes = items.map(item => {
                const title = item.querySelector("title")?.textContent ?? "";
                const description = item.querySelector("description")?.textContent ?? "";
                const pubDateRaw = item.querySelector("pubDate")?.textContent ?? "";
                const pubDate = pubDateRaw ? new Date(pubDateRaw) : null;
                const audioUrl = item.querySelector("enclosure")?.getAttribute("url") ?? "";
                const link = item.querySelector("link")?.textContent ?? "";

                return {
                    title,
                    description,
                    pubDate,
                    audioUrl,
                    link
                };
            });

            // 🔽 Sort: newest first
            episodes.sort((a, b) => b.pubDate - a.pubDate);

            episodes.forEach(ep => {
                const article = document.createElement("article");
                article.className = "episode";

                article.innerHTML = `
                    <h3>${ep.title}</h3>

                    ${
                        ep.pubDate
                            ? `<time datetime="${ep.pubDate.toISOString()}">
                                   ${ep.pubDate.toLocaleDateString("de-AT")}
                               </time>`
                            : ""
                    }

                    ${
                        ep.audioUrl
                            ? `<audio controls preload="none" src="${ep.audioUrl}"></audio>`
                            : ""
                    }

                    <div class="description">
                        ${ep.description}
                    </div>

                    ${
                        ep.link
                            ? `<p class="listen">
                                   <a href="${ep.link}">
                                       ▶ Auf CBA anhören / Listen on CBA
                                   </a>
                               </p>`
                            : ""
                    }
                `;

                container.appendChild(article);
            });
        })
        .catch(err => {
            container.innerHTML = "<p>Episodes konnten leider nicht geladen werden.</p>";
            console.error(err);
        });
});

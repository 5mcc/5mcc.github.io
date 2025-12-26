document.addEventListener("DOMContentLoaded", () => {
    const FEED_URL =
        "https://api.rss2json.com/v1/api.json?rss_url=https://cba.media/podcast/5minutenclimatechance/feed";

    const container = document.getElementById("episodes");
    if (!container) return;

    fetch(FEED_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.items || data.items.length === 0) {
                container.innerHTML = "<p>Keine Episoden gefunden.</p>";
                return;
            }

            const episodes = data.items.map(item => ({
                title: item.title,
                description: item.description,
                pubDate: item.pubDate ? new Date(item.pubDate) : null,
                audioUrl: item.enclosure?.link ?? "",
                link: item.link
            }));

            // newest first
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

                    <p class="listen">
                        <a href="${ep.link}">
                            ▶ Auf CBA anhören / Listen on CBA
                        </a>
                    </p>
                `;

                container.appendChild(article);
            });
        })
        .catch(err => {
            container.innerHTML =
                "<p>Episodes konnten leider nicht geladen werden.</p>";
            console.error(err);
        });
});

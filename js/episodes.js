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
      // Add 'show' class instead of changing inline style
      showMoreBtn.classList.add('show');
      showMoreBtn.addEventListener("click", () => {
        visibleCount += 10;
        renderEpisodes(episodes);
        
        // Hide button if all episodes are shown
        if (visibleCount >= episodes.length) {
          showMoreBtn.classList.remove('show');
        }
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

<script>
    (function() {
        const btn = document.getElementById('show-more');
        const list = document.getElementById('episodes-list');
        if (!btn || !list) return;

        function initFolding() {
            const episodes = list.querySelectorAll('.episode');
            if (episodes.length === 0) return false;

            if (episodes.length <= 4) {
                btn.style.display = 'none';
                return true;
            }

            // create wrapper
            const wrapper = document.createElement('div');
            wrapper.id = 'extra-content';

            // move extra episodes (from index 4 onward) into wrapper
            const extras = [];
            for (let i = 4; i < episodes.length; i++) {
                extras.push(episodes[i]);
            }
            extras.forEach(el => wrapper.appendChild(el));

            // insert after the 4th episode
            const fourth = episodes[3];
            if (fourth && fourth.parentNode) {
                fourth.parentNode.insertBefore(wrapper, fourth.nextSibling);
            }

            let visible = false;
            btn.classList.add('show');

            btn.addEventListener('click', function() {
                visible = !visible;
                this.textContent = visible ? 'Zeig mir weniger ✦' : 'Zeig mir mehr ✦';
                if (visible) {
                    wrapper.style.maxHeight = wrapper.scrollHeight + 60 + 'px';
                    wrapper.classList.add('is-open');
                } else {
                    wrapper.style.maxHeight = '0';
                    wrapper.classList.remove('is-open');
                }
            });

            // start closed
            wrapper.style.maxHeight = '0';
            wrapper.style.opacity = '0';
            return true;
        }

        // try immediately (if episodes are already in the DOM)
        if (!initFolding()) {
            // otherwise wait for them via MutationObserver
            const observer = new MutationObserver(function(mutations, obs) {
                if (list.querySelectorAll('.episode').length > 0) {
                    initFolding();
                    obs.disconnect();
                }
            });
            observer.observe(list, { childList: true, subtree: true });
        }
    })();
</script>
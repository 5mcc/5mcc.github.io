fetch("/episodes.json")
  .then(res => {
    if (!res.ok) throw new Error("JSON missing");
    return res.json();
  })
  .then(renderEpisodes)
  .catch(err => {
    console.error(err);
    document.getElementById("episodes-list").textContent =
      "Episodes konnten leider nicht geladen werden.";
  });

  
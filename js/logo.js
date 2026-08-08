document.addEventListener("DOMContentLoaded", function () {

    const logos = [
        "logos/5mccLOGO2.png",
        "logos/5mccLOGO4.png",
        "logos/5mccLOGO6.png",
        "logos/5mccLOGO8.png"
    ];

    const chosen = logos[Math.floor(Math.random() * logos.length)];
    const logoElement = document.getElementById("site-logo");

    if (logoElement) {
        logoElement.src = chosen;
    }
});

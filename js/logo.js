document.addEventListener("DOMContentLoaded", function () {

    const logos = [
        "logos/5mccLOGO1.png",
        "logos/5mccLOGO3.png",
        "logos/5mccLOGO5.png",
        "logos/5mccLOGO7.png",
        "logos/5mccLOGO10.png"
    ];

    const chosen = logos[Math.floor(Math.random() * logos.length)];
    const logoElement = document.getElementById("site-logo");

    if (logoElement) {
        logoElement.src = chosen;
    }
});

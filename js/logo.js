document.addEventListener("DOMContentLoaded", function () {

    const logos = [
        "images/logos/logo-green.svg",
        "images/logos/logo-orange.svg",
        "images/logos/logo-blue.svg",
        "images/logos/logo-pink.svg"
    ];

    const chosen = logos[Math.floor(Math.random() * logos.length)];
    const logoElement = document.getElementById("site-logo");

    if (logoElement) {
        logoElement.src = chosen;
    }
});

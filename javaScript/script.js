function toggleNav() {
    var nav = document.getElementById("myNav");
    var menuIcon = document.getElementById("menuIcon");

    if (nav.style.width === "100%") {
        nav.style.width = "0%";
        menuIcon.innerHTML = "&#9776;"; // Hamburger icon
    } else {
        nav.style.width = "100%";
        menuIcon.innerHTML = "&times;"; // Close (X) icon
    }
}
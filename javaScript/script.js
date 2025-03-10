function toggleNav() {
    var nav = document.getElementById("myNav");
    var menuIcon = document.querySelector(".menu-toggle");

    if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuIcon.innerHTML = "&#9776;"; // Show hamburger when closed
    } else {
        nav.classList.add("open");
        nav.style.width = "100%"; // Ensure overlay takes full width
        menuIcon.innerHTML = "&times;"; // Show close icon when open
    }
}
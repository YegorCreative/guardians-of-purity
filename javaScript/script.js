function showAlert() {
    alert("Hello! This is a simple alert.");
}
let lastScrollTop = 0;
const navbar = document.querySelector('#navbar');

window.addEventListener("scroll", function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        navbar.style.top = "-80px"; // Hide menu on scroll down
    } else {
        navbar.style.top = "0"; // Show menu on scroll up
    }
    lastScrollTop = scrollTop;
});

/* Open the side navigation */
function openNav() {
    let sidenav = document.getElementById("mySidenav");
    sidenav.classList.add("open");
    sidenav.style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Close the side navigation */
  function closeNav() {
    let sidenav = document.getElementById("mySidenav");
    sidenav.classList.remove("open");
    sidenav.style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
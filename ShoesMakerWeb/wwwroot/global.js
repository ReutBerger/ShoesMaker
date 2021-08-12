/* Back to top button */

// Get the button
    var mybutton = document.getElementById("getToTopBtn");

    // When the user scrolls down 20px from the top of the document, show the button.
window.onscroll = function () {scrollFunction(); stickyFunction(); };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document.
function topFunction() {
        document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/* sticky navbar */

// Get the navbar
var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

// Stick the navbar while scrolling.
function stickyFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}


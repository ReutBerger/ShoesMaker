/* Shop Buttons functionality */

let pageNum = 1;

// When one of the shoes type button is pressed.
function getShoesByType(type) {
    var selectedType = type.substring(1);
    window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum;
}

/*--------------------------------------------------------------------------------*/

/* Load page functionality */

let wishlist = [];
let cartList = [];

window.onload = loadFunc();

function loadFunc() {
    // Get wishlist.
    wishlist = JSON.parse(sessionStorage.getItem("wishlist"));

    // Wishlist intalization.
    if (wishlist == null) {
        wishlist = [];
        // Save list for the firs time.
        sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  
    wishlistNotification();

    // Get cart list.
    cartList = JSON.parse(sessionStorage.getItem("cartList"));
    cartListNotification();
}

// Wishlist notification visibility.
function wishlistNotification() {
    var heart = document.getElementById("wishlist");

    if (wishlist != null && wishlist.length > 0) {
        heart.style.visibility = "visible";
        heart.innerText = wishlist.length;
    } else {
        heart.style.visibility = "hidden";
    }
}

// Cart notification visibility.
function cartListNotification() {
    var bag = document.getElementById("cart");
    if (cartList == null || cartList.length == 0) {
        bag.style.visibility = "hidden";
    } else {
        bag.style.visibility = "visible";
        bag.innerText = cartList.length;
    }
}

/*--------------------------------------------------------------------------------*/

/* Wishlist Button functionality */

// When a heart button is pressed.
function goToWishlistPage() {
    window.location.href = "../Shop/wishlist.html";
}

/*--------------------------------------*/

/* Cart Button functionality */

// When a bag button is pressed.
function goToCartPage() {
    window.location.href = "../cart.html";
}

/*--------------------------------------------------------------------------------*/

/* Scrolling functionality */

// Get the elements.
var mybutton = document.getElementById("backToTopBtn");
var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

// When the user scrolls down 20px from the top of the document, show the button.
window.onscroll = function () { scrollFunction(); stickyFunction(); };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

/* Back to top button */

// When the user clicks on the button, scroll to the top of the document.
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/* Sticky navbar */

// Stick the navbar while scrolling.
function stickyFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}
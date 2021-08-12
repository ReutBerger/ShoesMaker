/* Category Buttons functionality */

let shoesList = [];
let selectedType = "";
let pageNum = 1;

// When one of shoes type button is pressed.
function getShoesByType(type) {
    selectedType = type.substring(1);
    let url = "/api/shoes?type=" + selectedType + "&pageNum=" + pageNum;
    $.ajax({
        type: "GET",
        url: url,
        success: successGetShoes,
        error: function () {
            alert("Error in getting shoes");
        }
    });
}

function successGetShoes(json) {
    var shoes = JSON.parse(json);

    // TODO: CHANGE 2 TO 20
    for (var i = 0; i < 2; i++) {
        var itemDetails = [shoes[i].Id, shoes[i].image, shoes[i].price];
        shoesList.push(itemDetails);
    }

    // Add to sessionStorage shoes list.
    sessionStorage.setItem("shoesList" + selectedType + pageNum, JSON.stringify(shoesList));

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

    wishlistNotification();

    // Get cart list.
    cartList = JSON.parse(sessionStorage.getItem("cartList"));
    cartListNotification();

}

// Wishlist notification visibility.
function wishlistNotification() {
    var heart = document.getElementById("wishlist");

    if (wishlist != null && wishlist.length - 1 > 0) {
        heart.style.visibility = "visible";
        heart.innerText = wishlist.length - 1;
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
    if (wishlist == null || wishlist == "" || wishlist == "null") {
        window.location.href = "../Shop/wishlist.html";
    }
    for (var wish of wishlist) {
        if (wish == "" || wish == "null") {
            continue;
        }
        var id = wish.substr(8, wish.length - 1);
        wishlistFunc(id);
    }
}

function wishlistFunc(id) {
    let url = "/api/oneShoe?id=" + id;
    $.ajax({
        type: "GET",
        url: url,
        success: successGetOneShoeWish,
        error: function () {
            alert("Error in getting shoe details");
        }
    });
}

function successGetOneShoeWish(json) {
    var shoe = JSON.parse(json);
    var shoeDetails = [shoe.Id, shoe.image, shoe.price];

    // Keep a shoe in storage according to its ID.
    sessionStorage.setItem(shoe.Id, JSON.stringify(shoeDetails));

    window.location.href = "../Shop/wishlist.html";
}

/*--------------------------------------------------------------------------------*/

/* Cart Button functionality */

// When a bag button is pressed.
function goToCartPage() {
    if (cartList == null || cartList == "") {
        window.location.href = "../cart.html";
    }
    for (var item of cartList) {
        if (item == "" || item == "null") {
            continue;
        }
        var id = item[0];
        cartFunc(id);
    }
}

function cartFunc(id) {
    let url = "/api/oneShoe?id=" + id;
    $.ajax({
        type: "GET",
        url: url,
        success: successGetOneShoeCart,
        error: function () {
            alert("Error in getting shoe details");
        }
    });
}

function successGetOneShoeCart(json) {
    var shoe = JSON.parse(json);
    var shoeDetails = [shoe.Id, shoe.image, shoe.price];

    // Keep a shoe in storage according to its ID.
    sessionStorage.setItem(shoe.Id, JSON.stringify(shoeDetails));

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

/* sticky navbar */

// Stick the navbar while scrolling.
function stickyFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}
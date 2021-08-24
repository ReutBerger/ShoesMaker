﻿/* Shop buttons functionality */

let selectedType = "";
let pageNum = 1;

// When one of shoes type button is pressed.
function getShoesByType(type) {
    selectedType = type.substring(1);
    window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum;
}

/*--------------------------------------------------------------------------------*/

/* Load page functionality */

let itemID = "";
let size = "";
let price = "";
let quantity = "";
let count = 1;

let wishlist = [];
let cartList = [];

// Loading animation.
$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); }
});

window.onload = loadFunc();

function loadFunc() {
    // Get wishlist.
    wishlist = JSON.parse(sessionStorage.getItem("wishlist"));

    // Get cart list.
    cartList = JSON.parse(sessionStorage.getItem("cartList"));
    cartListNotification();

    // Get item name.
    var name = document.getElementById("name");
    itemID = GetURLParameter("imageID");
    name.innerText = "Product Name: " + itemID;

    // Get item category.
    var category = document.getElementById("category");
    category.innerText = "Category: " + GetURLParameter("category");

    // Get Item details from DB - image/price.
    getItemDetails(itemID);
}

// Extracts parameters from URL.
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

// Get from DB this shoe details.
function getItemDetails(id) {
    let url = "/api/oneShoe?id=" + id;
    $.ajax({
        type: "GET",
        url: url,
        success: successGetOneShoe,
        error: function () {
            alert("Error in getting shoe details");
        }
    });
}

function successGetOneShoe(json) {
    var shoe = JSON.parse(json);

    // Get item price.
    price = shoe.price;
    document.getElementById("price").innerText = "$ " + price;

    // Wishlist (button) view.
    if (isInWishlist("wishlist" + itemID)) {
        var itemWish = document.getElementById("itemWish");
        itemWish.src = "../Images/remove.png";
    }
    wishlistNotification();

    // Get item image.
    var itemImage = document.getElementById("itemImage");
    itemImage.src = "data:image/png;base64," + shoe.image;
}

// Check if this shoe is in wishlist.
function isInWishlist(id) {
    var pos = wishlist.indexOf(id);
    if (pos >= 0) {
        return true;
    }
    return false;
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

// Change view according to clicks.
function addToWishlist(id) {
    clickOnWishImg = true;
    var selectedItem = document.getElementById(id);
    if (selectedItem.src.match("add.png")) {
        // If fill change to clear
        selectedItem.src = "../Images/remove.png";
        selectedItem.parentElement.title = "Click to remove this shoe from wishlist!";
        push_item("wishlist" + itemID);
    } else {
        // If clear change to fill
        selectedItem.src = "../Images/add.png";
        selectedItem.parentElement.title = "Click to add this shoe to wishlist!";
        delete_item("wishlist" + itemID);

    }
    selectedItem.style.width = "28px";
    selectedItem.style.height = "28px";

    // Update wishlist
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));

    wishlistNotification();
}

// Remove item from wishlist.
function delete_item(id) {
    for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i] == id)
            break
    }
    wishlist.splice(i, 1);
}

// Insert item to wishlist.
function push_item(id) {
    for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i] == id)
            break;
    }
    wishlist.push(id);
}

// When a heart button is pressed.
function goToWishlistPage() {
     window.location.href = "../Shop/wishlist.html";
}

/*--------------------------------------------------------------------------------*/

/* Cart Button functionality */

function addItemToCart() {
    // cartlist intalization.
    if (cartList == null) {
        cartList = [];
    }

    quantity = count;
    var itemDetails = [itemID, size, price, quantity];

    if (idLastSelected != "") {
        // Add to cart
        push_cart_item(itemDetails);

        cartListNotification();

        sessionStorage.setItem("cartList", JSON.stringify(cartList));

    } else {
        alert("You must select size first, try again!");
        document.getElementById("cart").disabled = true;
    }
}

// Add to cart list.
function push_cart_item(item) {
    for (var i = 0; i < cartList.length; i++) {
        if (cartList[i][0] == item[0] && cartList[i][1] == item[1]) {
            cartList[i][3] += item[3];
            return;
        }
    }
    cartList.push(item);
}

// When a bag button is pressed.
function goToCartPage() {
    window.location.href = "../cart.html";
}

/*--------------------------------------------------------------------------------*/

/** Size buttons functionality **/

let idLastSelected = "";

function selectedSize(id) {
    var button = document.getElementById(id);
    button.style.backgroundColor = "lightblue";
    button.style.border = "1px solid black";
    var lastBtn = document.getElementById(idLastSelected);
    if (lastBtn != null) {
        lastBtn.style.backgroundColor = '#bbb';
        lastBtn.style.border = "none";
        lastBtn.style = "dot";
    }

    idLastSelected = id;
    size = id;
}

/*--------------------------------------------------------------------------------*/

/** Calculate the quantity **/

function increase() {
    count++;
    document.getElementById("number").innerText = count;
    if (count >= 9) {
        document.getElementById("number").innerText = 9;
        count = 9;
    }
}

function decrease() {
    count--;
    document.getElementById("number").innerText = count;
    if (count <= 1) {
        document.getElementById("number").innerText = 1;
        count = 1;
    }
}
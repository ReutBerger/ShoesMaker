/* Shop buttons functionality */

let selectedType = "";
let pageNum = 1;

// When one of the shoes type button is pressed.
function getShoesByType(type) {
    selectedType = type.substring(1);
    window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum;
}

/*--------------------------------------------------------------------------------*/

/* Load page functionality */

let clickOnDeleteBtn = false;
let wishlist = [];
let cartList = [];
let list = [];

// loading animation.
$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); showView();}
});

window.onload = loadFunc();

function loadFunc() {
    // Get wishlist
    wishlist = JSON.parse(sessionStorage.getItem("wishlist"));

    wishlistNotification();

    // Load view.
    if (wishlist == "" || wishlist.length == 0 || wishlist == null) {
        showView();
    } else {
        getAllWishlist();
    }
   
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

// Page visibility.
function showView() {
    var showE = document.getElementById("emptyMassageContainer");
    var showI = document.getElementById("showItemsContainer");
    if (wishlist == null || wishlist == "") 
    {
        // Your wishlist is currently empty!
        showE.style.visibility = "visible";
        showI.style.visibility = "hidden";
    }
    else {
        // Bulid wishlist Products items view.
        showI.style.visibility = "visible";
        showE.style.visibility = "hidden";
        createItemsViews();
    }
}

// Add items to items container while running.
function createItemsViews() {
    var i = 0; //rows
    var j = 1; //items
    for (var wish of list) {
        var id = wish[0];
        var price = wish[2];
        var src = "data:image/png;base64," + wish[1];
        if (j % 5 == 1) {
            i++;
            $('#itemsContainer').append(
                '<div class="row" id="row' + i + '">' +
                '<div class="column ima">' +
                '<div class="item" onclick="showMoreDetailes(id)" id="' + id + '">' +
                '<button class="removeBtn" title="Click to remove this item from wishlist!" onclick="removeFromWishlist(id)" id="' + wish + '">' +
                '<i class="fa fa-trash" aria-hidden="true"></i>' +
                '</button>' +
                '<img id="imageSrc' + id + '" src="' + src + '">' +
                '<p class="price">$ ' + price + '</p>' + '</div>' + '</div>' + '</div>');
        }
        else {
            $('#row' + i + '').append(
                '<div class="column ima">' +
                '<div class="item" onclick="showMoreDetailes(id)" id="' + id + '">' +
                '<button class="removeBtn" title="Click to remove this item from wishlist!" onclick="removeFromWishlist(id)" id="' + wish + '">' +
                '<i class="fa fa-trash" aria-hidden="true"></i>' +
                '</button>' +
                '<img id="imageSrc' + id + '" src="' + src + '">' +
                '<p class="price">$ ' + price + '</p>' + '</div>' + '</div>' + '</div>');
        }

        j++;
    }
}

// Get all wishlist shoes details from DB.
function getAllWishlist() {
    for (var wish of wishlist) {
        var id = wish.substr(8, wish.length - 1);
        wishlistFunc(id);
    }
}

/*--------------------------------------------------------------------------------*/

/* Wishlist Button functionality */

// When a heart button is pressed.
function goToWishlistPage() {
     window.location.href = "../Shop/wishlist.html";
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

    // Add to local list.
    list.push(shoeDetails);
}

/*--------------------------------------------------------------------------------*/

/* Cart Button functionality */

// When a bag button is pressed.
function goToCartPage() {
    window.location.href = "../cart.html";
}

/*--------------------------------------------------------------------------------*/

/** Scrolling functionality **/

// Get the elements.
var mybutton = document.getElementById("backToTopBtn");
var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

// When the user scrolls down 200px from the top of the document, show the button.
window.onscroll = function () { scrollFunction(); stickyFunction(); };

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
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

/*--------------------------------------------------------------------------------*/

/** buttons functionality **/

/* Show more details button */

function showMoreDetailes(id) {
    if (wishlist.length != 0) {
        sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    if (!clickOnDeleteBtn) {
        // Show more details of this "id" shoe.
        var category = getCategoryName(id);
        window.location.href = '../Shop/moreDetails.html?imageID=' + id + '&category=' + category;
    } else {
        clickOnDeleteBtn = false;
    }
}

function getCategoryName(str) {
    var res = str.substring(0, 2);
    if (res == "bo")
        return "Boots";
    else if (res == "sa")
        return "Sandals";
    else if (res == "sl")
        return "Slippers";
    else
        return "Sneakers";
}

/* Delete item from wishlist button */

// Delete specific item from list.
function delete_item(id) {
    for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i] == "wishlist" + id)
            break;
    }
    wishlist.splice(i, 1);
}

// Delete specific item from list.
function delete_item_from_list(id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][0] == id)
            break;
    }
    list.splice(i, 1);
}

function removeFromWishlist(item) {
    clickOnDeleteBtn = true;

    var id = item.split(',')[0];

    // Remove from the wishlist.
    delete_item(id);

    // Remove from the local list.
    delete_item_from_list(id);

    // Remove from item view.
    var parent = document.getElementById("itemsContainer");
    parent.innerHTML = '';

    // Update cookies after wishlist changing.
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Upddate wishlist notification.
    wishlistNotification();
    showView();
}
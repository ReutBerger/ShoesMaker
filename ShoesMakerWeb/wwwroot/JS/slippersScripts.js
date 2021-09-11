/* Category Buttons functionality */

let selectedType = "slippers";
let pageNum = 1;

// When one of the shoes type button is pressed.
function getShoesfirstPage(type) {
    pageNum = 1;
    selectedType = type.substring(1);
    window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum;
}

/*--------------------------------------------------------------------------------*/

/* Load page functionality */

// Global var
let clickOnWishImg = false;
let sizeOfWishlist = 0;
let sizeOfCartList = 0;
let selectedOrder = "";

let wishlist = [];
let cartList = [];
let shoesList = [];

// Loading animation.
try {
    $body = $("body");
    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); loadWishlist(); }
    });
}
catch (err) {
    showError("Network connection error");
}

window.onload = loadFunc();

function loadFunc() {

    // Set active page view.
    showActivePage();

    // Get this page shoes list - check if order by price.
    selectedOrder = GetURLParameter("order");
    if (selectedOrder == "" || selectedOrder == undefined) {
        getShoesByType("slippers");
    } else {
        // Show item order by - selectedOrder.
        sortedFunc(selectedOrder);
    }

    // Get wishlist.
    wishlist = JSON.parse(sessionStorage.getItem("wishlist"));
    if (wishlist == null) {
        wishlist = [];
    }

    wishlistNotification();
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Get cart list.
    cartList = JSON.parse(sessionStorage.getItem("cartList"));
    cartListNotification();
}

function loadShoes() {
    var i = 0; //rows
    var j = 1; //items
    for (var item of shoesList) {
        var itemId = item[0];
        var imageSrc = "data:image/png;base64," + item[1];
        var price = "$ " + item[2];
        if (j % 5 == 1) {
            i++;
            $('#itemsContainer').append(
                '<div class="row" id="row' + i + '">' +
                '<div class="column ima">' +
                '<div class="item" onclick="showMoreDetailes(id)" id="' + itemId + '" title="Click to buy this shoe!">' +
                '<button class="wishlistBtn" title="Click to add this shoe to wishlist!">' +
                '<img class="wishlistBtnImg" onclick="addToWishlist(id)" id="wishlist' + itemId + '" src="../Images/add.png" />' +
                '</button>' +
                '<img id="imageSrc' + itemId + '" src="' + imageSrc + '" alt="slippers">' +
                '<p class="price">' + price + '</p>' + '</div>' + '</div>' + '</div>');
        }
        else {
            $('#row' + i + '').append(
                '<div class="column ima">' +
                '<div class="item" onclick="showMoreDetailes(id)" id="' + itemId + '" title="Click to buy this shoe!">' +
                '<button class="wishlistBtn" title="Click to add this shoe to wishlist!">' +
                '<img class="wishlistBtnImg" onclick="addToWishlist(id)" id="wishlist' + itemId + '" src="../Images/add.png" />' +
                '</button>' +
                '<img id="imageSrc' + itemId + '" src="' + imageSrc + '" alt="slippers">' +
                '<p class="price">' + price + '</p>' + '</div>' + '</div>');
        }
        j++;
    }
}

// Loads the items in the wishlist.
function loadWishlist() {
    for (var wish of wishlist) {
        var isIn = document.getElementById(wish);
        if (isIn != null) {
            isIn.src = "../Images/remove.png";
        }
    }
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

// Visually mark the current page.
function showActivePage() {
    pageNum = GetURLParameter("pageNumber");
    var btn = document.getElementById(pageNum);
    btn.className = "active";
}

// Get boots from the DB.
function getShoesByType(type) {
    let url = "/api/shoes?type=" + type + "&pageNum=" + pageNum;
    try {
        $.ajax({
            type: "GET",
            url: url,
            success: successGetShoes,
            error: function () {
                alert("Error in getting shoes");
            }
        });
    } catch (err) {
        showError("Error in getting shoes");
    }
}

function successGetShoes(json) {
    if (json == "error") {
        showError("DB connection failed, try reloading the page");
    } else {
        var shoes = JSON.parse(json);

        // Clean list from the prev page.
        shoesList = [];

        for (var i = 0; i < 50; i++) {
            var itemDetails = [shoes[i].Id, shoes[i].Image, shoes[i].Price];
            shoesList.push(itemDetails);
        }

        // Load shoes view.
        loadShoes();
    }
}

// Print error message.
function showError(message) {
    let x = document.getElementById("snackbar");
    x.innerText = message;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
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

/** Buttons functionality **/

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

/*--------------------------------------*/

/* Heart buttons functionality */

function delete_item(id) {
    for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i] == id)
            break
    }
    wishlist.splice(i, 1);
}

function push_item(id) {
    var bool = true;

    for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i] == id)
            bool = false;
    }
    if (bool) {
        wishlist.push(id);
    }
}

function addToWishlist(id) {
    clickOnWishImg = true;
    var selectedItem = document.getElementById(id);
    if (selectedItem.src.match("../Images/add.png")) {
        // If fill change to clear
        selectedItem.src = "../Images/remove.png";
        selectedItem.title = "Click to remove this shoe from wishlist!";
        //sizeOfWishlist++;
        push_item(id);
    } else {
        // If clear change to fill
        selectedItem.src = "../Images/add.png";
        selectedItem.title = "Click to add this shoe to wishlist!";
        //sizeOfWishlist--;
        delete_item(id);
    }
    selectedItem.style.width = "28px";
    selectedItem.style.height = "28px";

    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));

    wishlistNotification();
}

/*--------------------------------------*/

/* More detaile buttons functionality */

function showMoreDetailes(id) {
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));

    if (!clickOnWishImg) {
        // Show more details of this "id" shoe.
        window.location.href = '../Shop/moreDetails.html?imageID=' + id + '&category=Slippers';
    } else {
        clickOnWishImg = false;
    }
}

/*--------------------------------------*/

/* Pagination buttons functionality */

var min = 0;
var max = 6;

// Move for the previous page.
function prevPage() {
    pageNum = pageNum - 1;
    if (pageNum == min) {
        pageNum = 1;
    }
    if (selectedOrder == "" || selectedOrder == undefined) {
        window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum;
    }
    else {
        // Show item order by - selectedOrder.
        window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum + "&order=" + selectedOrder;
    }
}

// Move for the next page.
function nextPage() {
    pageNum = (pageNum * 1) + 1;
    if (pageNum == max) {
        pageNum = 5;
    }
    if (selectedOrder == "" || selectedOrder == undefined) {
        window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum;
    }
    else {
        // Show item order by - selectedOrder.
        window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum + "&order=" + selectedOrder;
    }
}

// Move for the 'num' page.
function getPage(num) {
    if (selectedOrder == "" || selectedOrder == undefined) {
        window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + num;
    }
    else {
        // Show item order by - selectedOrder.
        window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + num + "&order=" + selectedOrder;
    }

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

/*--------------------------------------------------------------------------------*/

/* Sort item by price */

// When order by button is pressed.
function selectOrder() {
    var select = document.getElementById('mySelect');
    var val = select.options[select.selectedIndex].value;
    if (val == 1) {
        // Low to high price.
        // TODO: change numPage to 1 ????????? show always first page of type when sort?????????
        window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum + "&order=ascending";
    } else {
        // val == 2 - High to low price.
        window.location.href = "../Shop/" + selectedType + ".html?pageNumber=" + pageNum + "&order=descending";
    }
}

// Get boots sorted from the DB.
function sortedFunc(order) {
    selectedOrder = order;
    let url = "/api/sortedShoes?type=" + selectedType + "&order=" + order + "&pageNum=" + pageNum;
    try {
        $.ajax({
            type: "GET",
            url: url,
            success: successGetSortedShoes,
            error: function () {
                alert("Error in getting shoes");
            }
        });
    } catch (err) {
        showError("Error in getting shoes");
    }
}

function successGetSortedShoes(json) {
    if (json == "error") {
        showError("DB connection failed, try reloading the page");
    } else {
        var shoes = JSON.parse(json);

        for (var i = 0; i < 50; i++) {
            var itemDetails = [shoes[i].Id, shoes[i].Image, shoes[i].Price];
            shoesList.push(itemDetails);
        }

        // update view.
        loadShoes();
    }
}
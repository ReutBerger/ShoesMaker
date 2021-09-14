/* Load page functionality */

let clickOnDeleteBtn = false;
let list = [];

// Loading animation.
try {
    $body = $("body");
    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); showView(); }
    });
}
catch (err) {
    showError("Network connection error");
}

window.onload = loadFunc();

function loadFunc() {
    // Get wishlist
    wishlist = JSON.parse(sessionStorage.getItem("wishlist"));

    wishlistNotification();

    // Load view.
    if (wishlist == "" || wishlist == null || wishlist.length == 0) {
        showView();
    } else {
        getAllWishlist();
    }
   
    // Get cart list.
    cartList = JSON.parse(sessionStorage.getItem("cartList"));
    cartListNotification();
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

function wishlistFunc(id) {
    let url = "/api/oneShoe?id=" + id;
    try {
        $.ajax({
            type: "GET",
            url: url,
            success: successGetOneShoeWish,
            error: function () {
                alert("Error in getting shoe details");
            }
        });
    } catch (err) {
        showError("Error in getting shoe details");
    }
}

function successGetOneShoeWish(json) {
    if (json == "error") {
        showError("DB connection failed, try reloading the page");
    } else {
        var shoe = JSON.parse(json);
        var shoeDetails = [shoe.Id, shoe.Image, shoe.Price];

        // Add to local list.
        list.push(shoeDetails);
    }
}

// Print error message.
function showError(message) {
    let x = document.getElementById("snackbar");
    x.innerText = message;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

/*--------------------------------------------------------------------------------*/

/** Buttons functionality **/

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

/*----------------------------------------------*/

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
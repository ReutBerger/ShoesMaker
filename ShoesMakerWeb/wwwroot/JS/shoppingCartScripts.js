/* Load page functionality */

let quantity = [0];
let subtotal = 0;
let cartSize = 0;
const map = new Map();

// loading animation.
try {
    $body = $("body");
    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); showView(true); }
    });
}
catch (err) {
    showError("Network connection error");
}

window.onload = loadFunc();

function loadFunc() {
    // Get wishlist.
    wishlist = JSON.parse(sessionStorage.getItem("wishlist"));

    wishlistNotification();

    // Get cart list.
    cartList = JSON.parse(sessionStorage.getItem("cartList"));
    cartListNotification();

    // Load view.
    if (cartList == "" || cartList == null) {
        showView(true);
    } else {
        getAllCartlist();
        cartSize = cartList.length;
    }
}

// Page visibility.
function showView(bool) {
    var showE = document.getElementById("emptyMassageContainer");
    var showT = document.getElementById("showTableContainer");
    if (cartList == null || cartList.length == 0) {
        // Your wishlist is currently empty!
        showE.style.visibility = "visible";
        showT.style.visibility = "hidden";

        var ch = document.getElementById("cartContainer");
        ch.style.height = "530px";
    }
    else {
        // Bulid wishlist Products items view.
        showT.style.visibility = "visible";
        showE.style.visibility = "hidden";
        if (bool) {
            addRowsToItemTable();
        }
    }
}

// Add items to a table while running.
function addRowsToItemTable() {
    var i = 1;
    for (var item of cartList) {
        var name = item[0];
        var src = "data:image/png;base64," + map.get(name);
        var size = item[1];
        var price = item[2];
        quantity.push(item[3]);
        var total = (price * quantity[i]).toFixed(2);
        subtotal += (total * 1);

        // Add rows to tables.
        $('#table').append(
            '<tr id="row' + i + '">' +
            '<td class="delete">' +
            '<button class="deleteBtn" title="Click to remove this shoe!" onclick="removeRow(id)" id="' + i + '">' +
            '<i class="fa fa-trash"></i>' + '</button >' + '</td>' +
            '<td class="imageT">' +
            '<img class="image" id="row' + i + 'Img" src="' + src + '">' + '</td>' +
            '<td class="details">' +
            '<h3 id="row' + i + 'Name">' + name + '</h3>' +
            '<p id="row' + i + 'Size">Size: ' + size + '</p>' + '</td>' +
            '<td id="row' + i + 'Price">$ ' + price + '</td>' +
            '<td>' + '<div class="row rowAmountStyle">' +
            '<div class="column">' +
            '<button class="sizeBtn" onclick="decrease(id)" id="row' + i + 'Dec">-</button>' + '</div>' +
            '<div class="column">' +
            '<p class="num" id="row' + i + 'Num">' + quantity[i] + '</p>' + '</div>' +
            '<div class="column">' +
            '<button class="sizeBtn" onclick="increase(id)" id="row' + i + 'Inc">+</button>' + '</div>' + '</div>' + '</td>' +
            '<td class="total" id="row' + i + 'Total">$ ' + total + '</td>' + '</tr>'
        );

        i++;
    }

    // Fixed container height.
    var ch = document.getElementById("cartContainer");
    ch.style.height = (140 * i) + 500 + "px";

    // Update Total view.
    document.getElementById("totalSumText").innerText = "$ " + subtotal.toFixed(2);
}

// Get all wishlist shoes details from DB.
function getAllCartlist() {
    for (var item of cartList) {
        var id = item[0];
        cartFunc(id);
    }
}

/*--------------------------------------------------------------------------------*/

/* Cart Button functionality */

function cartFunc(id) {
    let url = "/api/oneShoe?id=" + id;
    try {
        $.ajax({
            type: "GET",
            url: url,
            success: successGetOneShoeCart,
            error: function () {
                alert("Error in getting shoe details");
            }
        });
    } catch (err) {
        showError("Error in getting shoe details");
    } 
}

function successGetOneShoeCart(json) {
    if (json == "error") {
        showError("DB connection failed, try reloading the page");
    } else {
        var shoe = JSON.parse(json);

        // Add to local list.
        map.set(shoe.Id, shoe.Image);
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

/* Clear all products from table */

function clearCart() {
    cartList = [];

    // Update sessionStorage after cart list changing.
    sessionStorage.setItem("cartList", JSON.stringify(cartList));

    // Show empty cart view.
    location.reload();
}

/* Go to checkout page */

function checkout() {
    window.location.href = "../payment.html";
}

/* Delete product button */

function removeRow(id) {
    var row = document.getElementById(id);
    var rowIndex = $(row).closest('tr').index();

    // Remove from the list.
    cartList.splice(rowIndex - 1, 1);

    // Remove row from table view.
    document.getElementById("table").deleteRow(rowIndex);

    // Fixed container height.
    var ch = document.getElementById("cartContainer");
    ch.style.height = (140 * (cartList.length + 1)) + 500 + "px";

    // Update cart totals view.
    calculateSubTotal();

    // Update sessionStorage after cart list changing.
    sessionStorage.setItem("cartList", JSON.stringify(cartList));

    // Upddate wishlist notification.
    cartListNotification();
    showView(false);
}

/*--------------------------------------------------------------------------------*/

/** Calculate the quantity **/

function increase(id) {
    // Get row index.
    var rowIndex = id.substring(3, 4);

    // Update quantity counter.
    var count = ++quantity[rowIndex];

    // Update quantity view.
    var elementName = "row" + rowIndex + "Num";
    document.getElementById(elementName).innerText = count;
    if (count > 9) {
        document.getElementById(elementName).innerText = 9;
        quantity[rowIndex] = 9;
        count = 9;
    }

    // Update cart list.
    var row = document.getElementById(id);
    var index = $(row).closest('tr').index();
    cartList[index - 1][3] = count;

    // Update sessionStorage after cart list changing.
    sessionStorage.setItem("cartList", JSON.stringify(cartList));

    // Update total view.
    updateTotalView(rowIndex);

    // Update cart totals view.
    calculateSubTotal();
}

function decrease(id) {
    // Get row index.
    var rowIndex = id.substring(3, 4);

    // Update quantity counter.
    var count = --quantity[rowIndex];

    // Update quantity view.
    var elementName = "row" + rowIndex + "Num";
    document.getElementById(elementName).innerText = count;
    if (count < 1) {
        document.getElementById(elementName).innerText = 1;
        quantity[rowIndex] = 1;
        count = 1;
    }

    // Update cart list.
    var row = document.getElementById(id);
    var index = $(row).closest('tr').index();
    cartList[index - 1][3] = count;

    // Update sessionStorage after cart list changing.
    sessionStorage.setItem("cartList", JSON.stringify(cartList));

    // Update total view.
    updateTotalView(rowIndex);

    // Update cart totals view.
    calculateSubTotal();
}

// Update the total column according to clicks.
function updateTotalView(i) {
    // Calculate total price.
    var price = document.getElementById("row" + i + "Price").innerText.substring(2);
    var amount = quantity[i];
    var total = (price * amount).toFixed(2);

    // Update total view.
    document.getElementById("row" + i + "Total").innerText = "$ " + total;
}

// Calculate the sub total view according to clicks.
function calculateSubTotal() {
    var sumtotal = 0;
    for (var i = 1; i <= cartSize; i++) {
        if (document.getElementById("row" + i + "Total") != null) {
            var tempTotal = document.getElementById("row" + i + "Total").innerText.substring(2);
            sumtotal = sumtotal + (1 * tempTotal);
        }
    }

    // Update Total view.
    document.getElementById("totalSumText").innerText = "$ " + sumtotal.toFixed(2);
}
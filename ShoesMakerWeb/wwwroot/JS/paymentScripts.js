/* load page functionality */

let cartList = [];
let sumTotal = 0;
window.onload = loadFunc();

function loadFunc() {
    // Get cart list.
    cartList = JSON.parse(sessionStorage.getItem("cartList"));

    updateView();
}

function updateView() {
    // update length of cart.
    document.getElementById("cartLength").innerText = cartList.length;

    for (var item of cartList) {
        if (item == "" || item == "null") {
            continue;
        }
        var name = item[0];
        var size = item[1];
        var price = item[2];
        var quantity = item[3];
        var total = (price * quantity).toFixed(2);
        sumTotal += (total * 1);

        // Add rows to cart list view.
        $('#table').append(
            '<li class="list-group-item d-flex justify-content-between lh-condensed">' +
            '<div>' +
            '<h6 class="my-0">' + name + '</h6>' +
            '<small class="text-muted">Size: ' + size + ', Quantity: ' + quantity + '</small>' +
            '</div>' +
            '<span class="text-muted">$ ' + total + '</span>' +
            '</li>'
        );
    }

    // Update Total view.
    document.getElementById("totalPrice").innerText = "$ " + sumTotal.toFixed(2);

    // Add cart scroll view.
    if (cartList.length > 8) {
        var ul = document.getElementById("table");
        ul.style.overflowY = "scroll";
        ul.style.height = "500px";
    }

}

/*--------------------------------------------------------------------------------*/

function submitPayment() {
    // TODO: ADD Massage attenion that not realy work!!
    alert("Finish Payment!!!");
}
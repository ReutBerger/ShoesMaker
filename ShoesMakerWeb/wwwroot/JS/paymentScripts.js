/* load page functionality */

let sumTotal = 0;

window.onload = loadFunc();

function loadFunc() {
    // Get cart list.
    cartList = JSON.parse(sessionStorage.getItem("cartList"));

    updateView();
}

function updateView() {
    // update length of cart.
    if (cartList == null) {
        alert("cart is empty go back to Shop pages!");
    } else {
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
                '<small id="price" class="text-muted">Size: ' + size + ', Quantity: ' + quantity + '</small>' +
                '</div>' +
                '<span id="price" class="text-muted">$ ' + total + '</span>' +
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
}

/*--------------------------------------------------------------------------------*/

window.onbeforeunload = function (event) {
    event.returnValue = "If you do this, the details may not be saved";
};

// Check required fields are filled.
try {
    $(function () {
        $('#submits').attr('disabled', true);
        $('#firstName').add('#lastName').add('#email').add('#address').add('#country').add('#state').add('#zip').add('#credit')
            .add('#cc-name').add('#cc-number').add('#cc-expiration').add('#cc-cvv').change(function check() {
            if ($('#firstName').val() != '' && $('#lastName').val() != '' && $('#email').val() != '' && $('#address').val() != ''
                && $('#country').val() != '' && $('#state').val() != '' && $('#zip').val() != '' && $('#credit').val() != ''
                && $('#cc-name').val() != '' && $('#cc-number').val() != '' && $('#cc-expiration').val() != '' && $('#cc-cvv').val() != '') {
                $('#submits').attr('disabled', false);
            } else {
                $('#submits').attr('disabled', true);
            }
        });
    });
} catch (err) {
    alert("Something went wrong, please try again!");
}

function submitPayment() {
    alert("The process is completed!\nNote that no payment was actually made!");
}
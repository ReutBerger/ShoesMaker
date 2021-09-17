/* Shop buttons functionality */

let selectedType = "sandals";

/*--------------------------------------*/

/* More detaile buttons functionality */

function showMoreDetailes(id) {
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));

    if (!clickOnWishImg) {
        // Show more details of this "id" shoe.
        window.location.href = '../Shop/moreDetails.html?imageID=' + id + '&category=Sandals';
    } else {
        clickOnWishImg = false;
    }
}
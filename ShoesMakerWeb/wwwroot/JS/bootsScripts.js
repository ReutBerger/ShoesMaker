/* Shop buttons functionality */

let selectedType = "boots";

/*--------------------------------------*/

/* More detaile buttons functionality */

function showMoreDetailes(id) {
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist));

    if (!clickOnWishImg) {
        // Show more details of this "id" shoe.
        window.location.href = '../Shop/moreDetails.html?imageID=' + id + '&category=Boots';
    } else {
        clickOnWishImg = false;
    }
}
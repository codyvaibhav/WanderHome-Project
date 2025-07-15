const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(validateListing, wrapAsync(listingController.createListing));

router.get("/new", isLoggedin, listingController.rendernewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(validateListing, isLoggedin, isOwner, wrapAsync(listingController.updateListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditform));

module.exports = router;
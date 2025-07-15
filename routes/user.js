const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const user = require("../models/user.js");

router
    .route("/signup")
    .get(userController.renderSignupform)
    .post(userController.signup);

router
    .route("/login")
    .get(userController.renderLoginform)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/users/login', failureFlash: true}), userController.login);

router.get("/logout",userController.logout);

module.exports = router;
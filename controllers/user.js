const User = require("../models/user");

module.exports.renderSignupform = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res,next) => {
    try{
        let{username,password,email} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        req.logIn(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WonderHome!");
            res.redirect("/listings");
          });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/users/signup");
    }
}

module.exports.renderLoginform = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req,res) => {
    req.flash("success", "Welcome back to WonderHome");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err) next(err);
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}
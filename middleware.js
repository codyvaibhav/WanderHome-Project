const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedin = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must login!");
        return res.redirect("/users/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have access!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body, { abortEarly: false });
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400,errMsg);
    }else next();
}

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body, { abortEarly: false });
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400,errMsg);
    }else next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
const Listing = require("../models/listing");

//Index route
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

//New route
module.exports.rendernewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

//Show route
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews", populate: {path : "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

//Create route
module.exports.createListing = async (req,res)=>{
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
    }

//Edit route
module.exports.renderEditform = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

//Update route
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}

//Delete route
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    // console.log(listing._id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}


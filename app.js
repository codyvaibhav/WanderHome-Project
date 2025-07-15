const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local")
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const usersRoute = require("./routes/user.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs',ejsMate);
require("dotenv").config();

const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl)
}
main().then( ()=> {
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: "mysupersecretcode"
    },
    touchAfter: 24*3600,
})
store.on("error",(err) => {
    console.log("ERROR IN MONGO SESSION STORE", err)
})

const sessionOptions = {
    store: store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() * 7*24*3600*1000,
        maxAge: 7*24*3600*1000,
        httpOnly: true
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.redirectUrl = req.originalUrl;
    next();
})

app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/users",usersRoute);

app.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// app.all("*",(req,res,next) => {
//     next(new ExpressError(404,"Page not Found!"));
// });

app.use((err,req,res,next) =>{
    let { statusCode=500, message="Something went wrong!" } = err;
    console.log(err);
    res.status(statusCode).render("listings/error.ejs",{message});
})

app.listen(8080, ()=> {
    console.log("listening");
})
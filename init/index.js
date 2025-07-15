const mongoose = require("mongoose");
const Listing = require("../models/listing");
const intiData = require("../init/data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then( ()=> {
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    intiData.data = intiData.data.map((obj) => ({...obj, owner: "6872d5a8c14f256596a58626"}));
    await Listing.insertMany(intiData.data);
    console.log("Data was reinitialized");
}

initDB();
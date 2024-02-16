const mongoose = require("mongoose")

//create address schema (in which format data will go)
const addressShcema = new mongoose.Schema({
    name: String,
    mobile: String,
    village: String,
    landmark: String,
    Street : String,
    housenumber:String,
    city: String,
    pincode : Number
})
// model is a communicator for DB and node.js
const addressCollection = mongoose.model("address", addressShcema)
module.exports = addressCollection
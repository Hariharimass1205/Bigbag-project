const mongoose =  require("mongoose")
const DBconnect =  async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/Project1");
        console.log("successfully connected to database");
    } catch (error) {
        console.log(error)
    }
}
module.exports = DBconnect;
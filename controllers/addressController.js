const addressCollection = require("../Model/addressModel")
const userModel = require("../Model/userModel")






const userAddressfn = async (req,res)=>{
    let userInfo2 = req.session.userInfo2
    console.log(userInfo2)
   const addressData = await addressCollection.find({
     userId:req.session.userInfo2._id
   });
   console.log(addressData)
   res.render("user/Addresspage", {
     currentUser: req.session.userInfo2._id,
     addressData
   });
 }
 
 const addAddressfn = (req,res)=>{
 res.render("user/ADDaddress",{
 currentUser: req.session.currentUser
 })
 }
 
 const saveaddressfn= async (req,res)=>{
   const user = await userModel.findOne({email:req.session.email})
   const userAddress = {
     userId : user._id,
     name : req.body.name,
     Phone: req.body.Phone,
     Address: req.body.Address,
     State: req.body.State,
     City:req.body.City,
   }
   const newAddress = await addressCollection.insertMany([userAddress])
   console.log(newAddress);
    req.session.address = newAddress
    res.redirect('/address')
 }
 
 const editAddressfn = async (req,res)=>{
   req.session.userInfo2;
   const existingAddress = await addressCollection.findOne({
     _id: req.params.id,
   });
   res.render("user/editAddress",{existingAddress})
 }
  
 const postEditAddressfn = async (req,res)=>{
   try {
     const address = {
       name: req.body.name,
       Phone: req.body.Phone,
       Address: req.body.Address,
       State: req.body.State,
       City: req.body.City,
     };
     await addressCollection.updateOne({ _id: req.params.id }, address);
     res.redirect("/address");
   } catch (error) {
     console.error(error);
   }
 }
 
 
 const deleteAddressfn =  async (req, res) => {
   try {
     await addressCollection.deleteOne({ _id: req.params.id });
     res.redirect("/address");
   } catch (error) {
     console.log(error);
   }
 }

 module.exports={
    deleteAddressfn,
    postEditAddressfn,
    editAddressfn,
    saveaddressfn,
    addAddressfn,
    userAddressfn
}
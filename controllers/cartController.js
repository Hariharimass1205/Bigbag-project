const categoryCollection = require("../Model/categoryModel");
const productCollection = require("../Model/productModel");
const userCollection = require("../Model/userModel");




const cartpagefn= async(req,res)=>{
    try {
      let userINFO = req.session.userInfo2;
      
      console.log("iewnenno"+userINFO._id)
      const carteditem = await productCollection.find({
        _id:req.params.id
      })
  
      console.log(carteditem )
      res.render("user/cartpage",{carteditem})
    } catch (error) {
      console.log(error)
    }
      
   }



   module.exports={cartpagefn}
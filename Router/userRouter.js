const express = require("express")
const userRouter = express.Router()
const {isUser} = require("../middleware/userloginmiddleware.js")



const {
    cartpagefn,
}= require("../controllers/cartController.js")

const {
    categoryFilterfn,
}=require("../controllers/categoryController.js")


const {
    sortPricefn,
    productCategoryfn,
    ProductDetailsfn
       }= require("../controllers/productController.js")


const { 
    userAddressfn,
    addAddressfn,
    saveaddressfn,
    editAddressfn,
    postEditAddressfn,
    deleteAddressfn,
      }= require("../controllers/addressController.js")


//import from userController
const { 
    landingPagefn,
    allordersfn,
    singleorderfn,
    userProfilefn,
    loginPagefn,
    forgetpage1fn,
    forgetpage4fn,
    forgetpage2fn,
    forgetpage3fn,
    insertUser,
    signupPagefn,
    sign2login,
    Existemailfn,
    logoutfn,
    optVerify,
    logincheckfn,
} = require("../controllers/userController.js")

//const {addCart}= require("../controllers/categoryController.js")

//login process
userRouter.get("/", landingPagefn)
userRouter.get("/login", loginPagefn)
userRouter.post("/login2", sign2login)
userRouter.get("/logout", logoutfn)
userRouter.post("/logincheck", logincheckfn)


// signup process
userRouter.get("/signup", signupPagefn)
userRouter.post("/userDetails", Existemailfn)
userRouter.post("/resentotp",insertUser)
userRouter.post("/otp", optVerify)


//pageing process
userRouter.get("/profile",isUser,userProfilefn)
userRouter.get("/address",isUser,userAddressfn)
userRouter.get("/addressAdd",isUser,addAddressfn)
userRouter.post('/saveAddress',saveaddressfn)
userRouter.get('/editAddress/:id',isUser,editAddressfn)
userRouter.post('/editAddress/:id', isUser,postEditAddressfn)
userRouter.get('/deleteAddress/:id',isUser,deleteAddressfn)
userRouter.get("/orders",isUser,allordersfn)
userRouter.get("/singleorder",singleorderfn)


//forget password process
userRouter.get("/forget1",forgetpage1fn)
userRouter.post("/forget2",forgetpage2fn)
userRouter.post("/forget3",forgetpage3fn)
userRouter.post("/forget4",forgetpage4fn)
userRouter.post("/resenOTP", optVerify)


// product visibility process
userRouter.get("/productCategory", isUser,productCategoryfn)
userRouter.get("/filterCategory",categoryFilterfn)
userRouter.get("/sortLow/:id",sortPricefn)
userRouter.get("/productDetails/:id",ProductDetailsfn)

// cart
userRouter.get("/cart/:id",cartpagefn)


//Main userRouter connect with Main page for connection
module.exports = userRouter


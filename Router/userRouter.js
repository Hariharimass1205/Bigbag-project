const express = require("express")
const userRouter = express.Router()
const {isUser} = require("../middleware/userloginmiddleware.js")

//import from userController
const { 
    landingPagefn,
    allordersfn,
    singleorderfn,
    userProfilefn,
    userAddressfn,
    loginPagefn,
    forgetpage1fn,
    forgetpage4fn,
    productCategoryfn,
    forgetpage2fn,
    forgetpage3fn,
    insertUser,
    cartpagefn,
    signupPagefn,
    sign2login,
    Existemailfn,
    logoutfn,
    optVerify,
    logincheckfn,
    addAddressfn,
    saveaddressfn,
    editAddressfn,
    postEditAddressfn,
    deleteAddressfn,
    categoryFilterfn,
  
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
userRouter.get("/address",userAddressfn)
userRouter.get("/addressAdd",addAddressfn)
userRouter.post('/saveAddress',saveaddressfn)
userRouter.get('/editAddress/:id',isUser,editAddressfn)
userRouter.post('/editAddress/:id', isUser,postEditAddressfn)
userRouter.get('/deleteAddress/:id',isUser,deleteAddressfn)
userRouter.get("/orders",allordersfn)
userRouter.get("/singleorder",singleorderfn)
userRouter.get("/cart",cartpagefn)


//forget password process
userRouter.get("/forget1",forgetpage1fn)
userRouter.post("/forget2",forgetpage2fn)
userRouter.post("/forget3",forgetpage3fn)
userRouter.post("/forget4",forgetpage4fn)
userRouter.post("/resenOTP", optVerify)


// product visibility process
userRouter.get("/productCategory",productCategoryfn)
userRouter.get("/filterCategory",categoryFilterfn)


//Main userRouter connect with Main page for connection
module.exports = userRouter


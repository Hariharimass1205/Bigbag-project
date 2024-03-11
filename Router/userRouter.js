const express = require("express")
const userRouter = express.Router()
const {isUser,isBlocked} = require("../middleware/userloginmiddleware.js")



const {
    cartpagefn,
    addtoCart,
    decQty,
    incQty,
    deleteFromCart,
    getcheckoutpagefn,
    orderPlacedEnd
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
    PrimaryCheckfn,
    notPrimaryCheckfn
}= require("../controllers/addressController.js")


//import from userController
const { 
    landingPagefn,
    userProfilefn,
    loginPagefn,
    forgetpage1fn,
    forgetpage4fn,
    forgetpage2fn,
    forgetpage3fn,
    insertUser,
    signupPagefn,
    sign2login,
    signupfn,
    logoutfn,
    optVerify,
    logincheckfn,
} = require("../controllers/userController.js")

const {
    allordersfn,
    singleorderfn,
    cancelOrder,
    returnRequest,
}= require("../controllers/orderController.js")

//login process
userRouter.get("/", landingPagefn)
userRouter.get("/login", loginPagefn)
userRouter.post("/login2", sign2login)
userRouter.get("/logout", logoutfn)
userRouter.post("/logincheck", logincheckfn)


// signup process
userRouter.get("/signup",signupPagefn)
userRouter.post("/userDetails",signupfn)
userRouter.post("/resentotp",insertUser)
userRouter.post("/otp",optVerify)


//pageing process
userRouter.get("/profile",isUser,isBlocked,userProfilefn)
userRouter.get("/address",isUser,isBlocked,userAddressfn)
userRouter.get("/addressAdd",isUser,isBlocked,addAddressfn)
userRouter.post('/saveAddress',isBlocked,saveaddressfn)
userRouter.get('/editAddress/:id',isUser,isBlocked,editAddressfn)
userRouter.post('/editAddress/:id',isBlocked, isUser,postEditAddressfn)
userRouter.get('/deleteAddress/:id',isUser,isBlocked,deleteAddressfn)
userRouter.get("/primary/:id",isBlocked,PrimaryCheckfn)
userRouter.get("/notPrimary/:id",isBlocked,notPrimaryCheckfn)
userRouter.get("/orders",isUser,allordersfn)
userRouter.get("/orderStatus/:id",isBlocked,singleorderfn)


//forget password process
userRouter.get("/forget1",isBlocked,forgetpage1fn)
userRouter.post("/forget2",isBlocked,forgetpage2fn)
userRouter.post("/forget3",isBlocked,forgetpage3fn)
userRouter.post("/forget4",isBlocked,forgetpage4fn)
userRouter.post("/resenOTP",isBlocked, optVerify)


// product visibility process
userRouter.get("/productCategory", isBlocked,isUser,productCategoryfn)
userRouter.get("/filterCategory",isBlocked,categoryFilterfn)
userRouter.get("/sortLow/:id",isBlocked,sortPricefn)
userRouter.get("/productDetails/:id",isBlocked,ProductDetailsfn)

// cart
userRouter.get("/cart/:id",isBlocked,cartpagefn)
userRouter.get("/cart",isBlocked,isUser,cartpagefn)
userRouter.post("/addto-cart/:id",isBlocked,addtoCart);
userRouter.put('/cart/decQty/:id',isBlocked,decQty)
userRouter.put('/cart/incQty/:id',isBlocked,incQty)
userRouter.delete('/cart/delete/:id',isBlocked,deleteFromCart);
userRouter.get("/checkout",isBlocked,getcheckoutpagefn)

userRouter.all('/confirmOrder',orderPlacedEnd)
userRouter.put('/cancelOrder/:id',cancelOrder )
userRouter.put('/returnorder/:id',returnRequest)
//Main userRouter connect with Main page for connection
module.exports = userRouter






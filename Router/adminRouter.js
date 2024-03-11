const express = require("express")
const adminRoute = express();
const {isAdmin} = require("../middleware/adminMiddlewares");
const multer = require('multer')
const path = require('path')
const upload = require('../service/multer.js')




const {
    loadLogin,
    verifyLogin,
    adminHome,
    adminLogout,
    userListController,
    unblockUserController,
    blockUserController,
}= require("../controllers/adminController.js")

const {
    categoriesPage,
    addCategoriesPage,
    addCategory,
    editCategory,
    editCategoriesPage,
    listCategory,
    unlistCategory,
}= require("../controllers/categoryController.js")

const {
    productlist,
    addProductPage,
    addProduct,
    editProductpage,
    editProduct,
    deleteProduct,
    unListProduct,
    listProduct
}= require("../controllers/productController.js")

const {
    orderManagement,
    changeStatusPending,
    changeStatusShipped,
    changeStatusDelivered,
    changeStatusReturn,
    changeStatusCancelled,
}= require('../controllers/orderController.js')


adminRoute.get('/',loadLogin);
adminRoute.post('/',verifyLogin);
adminRoute.get('/adminHome',adminHome)
adminRoute.get("/logout",adminLogout);


adminRoute.get("/userManagement",isAdmin,userListController);
adminRoute.get("/unblock-user/:id",isAdmin, unblockUserController);
adminRoute.get("/block-user/:id",isAdmin,blockUserController);


adminRoute.get('/categories',isAdmin,categoriesPage)
adminRoute.get('/addCategories',isAdmin,addCategoriesPage)
adminRoute.post('/categories/add',isAdmin,addCategory)


adminRoute.get('/categories/edit/:id',isAdmin,editCategory);
adminRoute.post('/editCategories/:id',isAdmin,editCategoriesPage)
adminRoute.post('/categories/list/:id', isAdmin,listCategory)
adminRoute.post('/categories/unlist/:id',isAdmin,unlistCategory)


adminRoute.get('/products',isAdmin,productlist)
adminRoute.get('/addProduct',isAdmin,addProductPage)
adminRoute.post('/addproduct',upload.any(),addProduct);
adminRoute.get('/productEdit/:id', isAdmin,editProductpage);
adminRoute.post('/editProduct/:id',isAdmin,upload.any(),editProduct)
adminRoute.get('/deleteProduct/:id',isAdmin,deleteProduct)
adminRoute.post('/unlist/:id',isAdmin, unListProduct)
adminRoute.post('/list/:id',isAdmin, listProduct)


adminRoute.get("/orderManagement",isAdmin, orderManagement);
adminRoute.get( "/orderManagement/pending/:id",isAdmin,changeStatusPending);
adminRoute.get("/orderManagement/shipped/:id",isAdmin,changeStatusShipped);
adminRoute.get("/orderManagement/delivered/:id",isAdmin,changeStatusDelivered);
adminRoute.get("/orderManagement/return/:id",isAdmin,changeStatusReturn);
adminRoute.get("/orderManagement/cancelled/:id",isAdmin,changeStatusCancelled);

//Main userRouter connect with Main page for connection
module.exports = adminRoute
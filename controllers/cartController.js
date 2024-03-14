const categoryCollection = require("../Model/categoryModel");
const productCollection = require("../Model/productModel");
const userCollection = require("../Model/userModel");
const cartCollection = require("../Model/cartModel");
const orderCollection = require("../Model/orderModel");
const addressCollection = require("../Model/addressModel");




   const grandTotal = async(req) => {
    try {
      console.log("session" + req.session.userInfo);
      let userCartData = await cartCollection
        .find({ userId: req.session.userInfo._id })
        .populate("productId");
      console.log(Array.isArray(userCartData));
      let grandTotal = 0;
      for (const v of userCartData) {
        grandTotal += v.productId.productPrice * v.productQuantity;
        await cartCollection.updateOne(
          { _id: v._id },
          {
            $set: {
              totalCostPerProduct: v.productId.productPrice * v.productQuantity,
            },
          }
        );
      }
      userCartData = await cartCollection
        .find({ userId: req.session.userInfo._id })
        .populate("productId");
        req.session.grandTotal = grandTotal;
        console.log( `jre,mmerrmiorcmurun${userCartData}`)
        return JSON.parse(JSON.stringify(userCartData));
      } catch (error) {
      console.log(error);
    }
  }
  
  
 
  const cartpagefn = async (req, res) => {
    try {
      const userInfo = req.session?.userInfo
      let userCartData = await grandTotal(req);
      let empty;
      userCartData == 0 ? (empty = true) : (empty = false);
      res.render("user/cartpage", {
        user: req.session?.userInfo,
        userCartData,
        grandTotal: req.session.grandTotal,
        empty,
      });
    } catch (error) {
      console.error(error);
    }
  };


  const addtoCart = async (req, res) => {
    try {
      let existingProduct = null;
      existingProduct = await cartCollection.findOne({
        userId: req.session.userInfo._id,
        productId: req.params.id,
      });
      if (existingProduct) {
        await cartCollection.updateOne(
          { _id: existingProduct._id },
          { $inc: { productQuantity: 1 } }
        );
      } else {
        await cartCollection.insertMany([
          {
            userId: req.session.userInfo._id,
            productId: req.params.id,
            productQuantity: req.body.productQuantity,
          },
        ]);
        console.log(req.body);
      }
      res.redirect("/cart");
    } catch (error) {
      console.log(error);
    }
  };

const incQty = async (req, res) => {
  try {
    let cartProduct = await cartCollection
      .findOne({ _id: req.params.id })
      .populate("productId");

    if (cartProduct.productQuantity < cartProduct.productId.productStock) {
      cartProduct.productQuantity++;
    }
    cartProduct = await cartProduct.save();
    await grandTotal(req);
    res.json({ cartProduct, grandTotal: req.session.grandTotal });
  } catch (error) {
    console.error(error);
  }
};

const decQty = async (req, res) => {
  try {
    let cartProduct = await cartCollection
      .findOne({ _id: req.params.id })
      .populate("productId");
    console.log(cartProduct);
    if (cartProduct.productQuantity > 1) {
      cartProduct.productQuantity--;
    }
    cartProduct = await cartProduct.save();
    await grandTotal(req);
    res.json({ 
      cartProduct,
       grandTotal: req.session.grandTotal });
  } catch (error) {
    console.error(error);
  }
};
  
  const deleteFromCart = async (req, res) => {
    try {
      await cartCollection.findOneAndDelete({ _id: req.params.id });
      res.send("hello ur cart is deleted");
    } catch (error) {
      console.error(error);
    }
  };

  const getcheckoutpagefn = async (req, res) => {
    try {
      const addresscheck = await addressCollection.find({userId:req.session?.userInfo?._id})
      if(addresscheck.length==0){
          res.redirect("/addressAdd")
      }else{
        let cartData = await cartCollection
        .find({ userId: req.session.userInfo._id, productId: req.params.id })
        .populate("productId");
      let addressData = await addressCollection.find({
        userId: req.session.userInfo._id,
        primary:true
      });
      console.log(addressData)
      req.session.currentOrder = await orderCollection.create({
        userId: req.session.userInfo._id,
        orderNumber: (await orderCollection.countDocuments()) + 1,
        orderDate: new Date(),
        addressChosen: JSON.parse(JSON.stringify(addressData[0])),
        cartData: await grandTotal(req),
        grandTotalCost: req.session.grandTotal,
      });
      let userCartData = await grandTotal(req);
      req.session.save()
      res.render("user/checkout1", {
        signIn: req.session.signIn,
        user: req.body.user,
        currentUser: req.session.userInfo,
        grandTotal: req.session.grandTotal,
        userCartData,
        cartData,
        addressData: req.session.address,
        addressData,
      });
      }
      
    } catch (error) {
      res.redirect("/cart");
    }
  };

  const orderPlacedEnd = async (req, res) => {
    console.log(req.session.userInfo)
    let cartData = await cartCollection
      .find({ userId: req.session.userInfo._id })
      .populate("productId");
    // console.log(cartData);
    console.log("safjkdhf");
    cartData.map(async (v) => {
      v.productId.productStock -= v.productQuantity; //reducing from stock qty
      await v.productId.save();
      return v;
    });
    
    
    let orderData= await orderCollection.findOne({ _id: req.session.currentOrder._id})
    if(orderData.paymentType =='toBeChosen'){
      orderData.paymentType = 'COD'
      orderData.save()
    }
    let x = await cartCollection.findByIdAndUpdate({ _id: req.session.currentOrder._id}).populate("productId");
    console.log('StockSold incremented successfully.');
    console.log("rendering next");
    res.render("user/checkout2", {
      signIn: req.session.signIn,
      user: req.session.user,
      orderCartData: cartData,
      orderData: req.session.currentOrder,
    });
    //delete product from cart since the order is placed
    await cartCollection.deleteMany({ userId: req.session.userInfo._id });
    console.log("deleting finished");
  };

  module.exports={cartpagefn,addtoCart,decQty,incQty,deleteFromCart,getcheckoutpagefn,orderPlacedEnd}
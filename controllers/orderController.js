const orderCollection = require("../Model/orderModel")
const formatDate = require("../service/dateFormate")
// order management page
const orderManagement = async (req, res) => {
    try {
      let page = Number(req.query.page) || 1;
      let limit = 15;
      let skip = (page - 1) * limit;
  
      let count = await orderCollection.find().estimatedDocumentCount();
      let orderData = await orderCollection
        .find().sort({orderNumber: -1})
        .populate("userId").skip(skip).limit(limit);
      console.log(orderData[0]);
      console.log(orderData);
      res.render("admin/orderManagement", { orderData, count, limit, page });
    } catch (error) {
      console.error(error);
    }
  };
  // pending
const changeStatusPending = async (req, res) => {
  try {
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Pending" } }
    );
    res.redirect("/admin/orderManagement");
  } catch (error) {
    console.error(error);
  }
};

const changeStatusShipped = async (req, res) => {
  try {
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Shipped" } }
    );
    res.redirect("/admin/orderManagement");
  } catch (error) {
    console.error(error);
  }
};

//deliverd
const changeStatusDelivered = async (req, res) => {
  try {
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Delivered" } }
    );
    res.redirect("/admin/orderManagement");
  } catch (error) {
    console.error(error);
  }
};
//return
const changeStatusReturn = async (req, res) => {
  try {
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Retrun" } }
    );
    res.redirect("/admin/orderManagement");
  } catch (error) {
    console.error(error);
  }
};

//cancelled
const changeStatusCancelled = async (req, res) => {
  try {
    let orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("userId");
    await walletCollection.findOneAndUpdate( { userId : orderData.userId._id  }, { walletBalance: orderData.grandTotalCost })

    await userCollection.findByIdAndUpdate(
      { _id: orderData.userId._id },
      { wallet: orderData.grandTotalCost }
    );
    orderData.orderStatus = "Cancelled";
    orderData.save();
    res.redirect("/admin/orderManagement");
  } catch (error) {
    console.error(error);
  }
};



const allordersfn =  async (req, res) => {
  try {
    let orderData = await orderCollection.find({
      userId: req.session.userInfo._id,
    });
   
    //sending the formatted date to the page
    orderData = orderData.map((v) => {
      v.orderDateFormatted = formatDate(v.orderDate);
      return v;
    });

    res.render("user/orders", {
      currentUser: req.session.userInfo,
      orderData,
    });
  } catch (error) {
    console.error(error);
  }
}

const singleorderfn =  async (req, res) => {
  try {
    let orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("addressChosen");
      console.log(orderData)
    let isCancelled = orderData.orderStatus == "Cancelled";
    let isReturn = orderData.orderStatus == "Retrun";
    res.render("user/singleorderpage", {
      currentUser: req.session.userInfo,
      orderData,
      isCancelled,
      isReturn,
    });
  } catch (error) {
    console.error(error);
  }
}
  const cancelOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    console.log("hhhhhh", cancelReason);
    const orderData = await orderCollection.findOne({ _id: req.params.id });
    await orderCollection.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Cancelled", cancelReason } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
 const returnRequest = async (req, res) => {
  try {
    const { ReturnReason } = req.body;

    const orderData = await orderCollection.findOne({ _id: req.params.id });

    await orderCollection.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Retrun", ReturnReason } }
    );

    let walletTransaction = {
      transactionDate: new Date(),
      transactionAmount: orderData.grandTotalCost,
      transactionType: "Refund from cancelled Order",
    };

    await walletCollection.findOneAndUpdate(
      { userId: req.session.currentUser._id },
      {
        $inc: { walletBalance: orderData.grandTotalCost },
        $push: { walletTransaction },
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
  }
}
 
  module.exports ={
    orderManagement,
    changeStatusPending,
    allordersfn,
    cancelOrder,
    returnRequest,
    singleorderfn,
    changeStatusShipped,
    changeStatusDelivered,
    changeStatusReturn,
    changeStatusCancelled,
}
  
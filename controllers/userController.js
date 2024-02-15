const userModel = require("../Model/userModel.js")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")

const productCollection = require("../Model/productModel.js");
const categoryCollection = require("../Model/categoryModel.js");

const landingPagefn =(req,res) =>{
  req.session.userInfo
  req.session.userinfosignin
  req.session.isBlocked = false
   res.render("user/landingpage",{userInfo : req.session.userInfo})
}
const logincheckfn = async (req,res)=>{
     const Email = req.body.Email
     const Password = req.body.Password
     const userCheck = await userModel.findOne({email:Email, isBlocked: false })
     if (userCheck){
       const passCheck = await bcrypt.compare(Password,userCheck.Password)
       if(passCheck){
        req.session.userInfo = userCheck.fname + userCheck.lname
        res.redirect("/") 
       }else{
        req.session.userInvalid = true
        req.session.signsuccess = false
        res.redirect("/login")
        }
     }else{
       req.session.isBlocked = true
       req.session.userInvalid = true
       req.session.signsuccess = false
       res.redirect("/login")
     }
}
const loginPagefn = (req,res)=>{
  res.render("user/login",{userInvalid : req.session.userInvalid,isBlocked: req.session.isBlocked})
  req.session.userInvalid = false
  req.session.isBlocked = false
} 
const logoutfn =(req,res)=>{
  req.session.userInvalid = false
  req.session.userInfo = false
  res.redirect("/")
}
const sign2login = (req,res)=>{
      req.session.signsuccess = true
      res.redirect("/login")
}
const signupPagefn = (req,res)=>{
  try{
    req.session.emailExist;
    res.render("user/signup",{emailExist : req.session.emailExist})
    req.session.emailExist = false
    req.session.save()
  }catch(err){
    console.log(`Error from signup ${err}`)
  }
}
//sign up validation and otp send
const Existemailfn = async (req, res) => {
  let exist = req.body.Email;
  try {
    const user = await userModel.findOne({ email: exist });
    if (!user) {
       const Password = await bcrypt.hash(req.body.Password,10);
       const userDetail = {
         fname: req.body.fname,
         lname: req.body.lname,
         email: req.body.Email,
         Password: Password,
        };
        req.session.userDetail = userDetail;
        const otp =  await emailOtp(req.body.Email)
        req.session.otp = otp
        console.log(otp)
        const userdetails = req.session.userDetail
        req.session.userInfo = userdetails.fname + userdetails.lname 
        req.session.islogin = false
        res.render("user/otppage");
      } else {
        req.session.emailExist = true;
        res.redirect("/signup"); 
      }
    } catch (error) {
      console.error(`Error checking email existence: ${error}`);
      res.status(500).send("Internal Server Error");
    }
  };
  const optVerify = async (req,res)=>{
      const otp = req.session.otp
     if(otp === Number(req.body.otp)){
       const userdetails = req.session.userDetail
       await userModel(userdetails).save()
       req.session.userInfo = userdetails.fname + userdetails.lname 
       req.session.islogin = true
       res.redirect("/")
     }else{
      res.render("user/otppage",{invalidotp : "OTP Invalid"})
     }
  }
  const forgetpage1fn = (req,res)=>{
    try {
      res.render("user/forgetpage1")
    } catch (error) {
    console.log(error)
  }
 }
 const forgetpage2fn = async (req,res)=>{
   try {
     const forgetEmail = req.body.email
    req.session.forgetEmail = req.body.email
    const otp =  await Passresetotp(forgetEmail)
    req.session.resetopt = otp
    res.render("user/forgetpage2")
  } catch (error) {
    console.log(error)
  }
}
const forgetpage3fn = (req,res)=>{
  try {
     const otp = Number(req.body.resetotp)
     const ourotp = req.session.resetopt
     if(otp===ourotp){
       res.render("user/forgetpage3")
      }else{
        console.log("else worked in forget 3")
        req.session.resetotpinvalid = true
        res.render("user/forgetpage2")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const forgetpage4fn = async (req,res)=>{
    const newpass = req.body.NewPassword
    const email = req.session.forgetEmail
    console.log(req.session.forgetEmail)
    const user = await userModel.findOne({ email: email });
    const passwordHash = await bcrypt.hash(newpass, 10);
     const newfeild =  await userModel.findByIdAndUpdate(
        { _id: user._id },
        { $set: {Password: passwordHash} 
      })
      res.redirect("/login")
  }
  //render into otp function
const insertUser = async (req, res) => {
  const email = req.session.forgetEmail;
  console.log(req.session.forgetEmail)
  let otp = await resentotp(email);
  req.session.otp1 = otp;
  res.render("user/otppage");
};

 // callback fn for otp
const emailOtp = async (email) => {
   try {
     console.log(email)
     const emailID = email;
     const transport = nodemailer.createTransport({
       service: "Gmail",
       auth: {
         user: "hariharimass1205@gmail.com",
         pass: "fagn tumb wdcc lyjt",
       },
     })
     const otp = Math.floor(100000 + Math.random() * 900000);
     const mailOptions = {
       from: "hariharimass1205@gmail.com",
       to: emailID,
       subject: "OTP Verification",
       text: `Your OTP IS:${otp}`,
     };
     console.log(`from email gentrate`)
     //Send the email
     let mail = await transport.sendMail(mailOptions);
     return otp
   } catch (err) {
     console.log(`Error from emailOtp router ${err}`);
   }
 };

 const Passresetotp = async (email) => {
  try {
    const emailID = email;
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "hariharimass1205@gmail.com",
        pass: "fagn tumb wdcc lyjt",
      },
    })
    const otp = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: "hariharimass1205@gmail.com",
      to: emailID,
      subject: "Reset Password",
      text: `Your One Time Otp is = ${otp}`,
    };
    console.log(otp)
    //Send the email
    let mail = await transport.sendMail(mailOptions);
    return otp
  } catch (err) {
    console.log(`Error from emailOtp router ${err}`);
  }
};


const productCategoryfn = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 4;
    let skip = (page - 1) * limit;

    let categoryData = await categoryCollection.find({ isListed: true });
    let productData = await productCollection
      .find({ isListed: true })
      .skip(skip)
      .limit(limit)

    let count = await productCollection.countDocuments({ isListed: true });

    let totalPages = Math.ceil(count / limit);
    let totalPagesArray = new Array(totalPages).fill(null);

    res.render("user/productsCategory", {
      categoryData,
      productData,
      currentUser: req.session.currentUser,
      user: req.session.user,
      count,
      limit,
      totalPagesArray,
      currentPage: page,
      selectedFilter: req.session.selectedFilter,
    });
    console.log(req.session.currentUser);
  } catch (error) {   
    console.error("Error fetching product data:", error);
    res.status(500).send("Internal Server Error");
  }
};
  
const userProfilefn = (req,res)=>{
  res.render("user/Profilepage")
}

const userAddressfn = (req,res)=>{
  res.render("user/addresspage")
}
const allordersfn = (req,res)=>{
res.render("user/orders")
}
const singleorderfn =(req,res)=>{
  res.render("user/singleorderpage")
}
const cartpagefn = (req,res)=>{
  res.render("user/cartpage")
}


module.exports={logincheckfn,
  singleorderfn,
  cartpagefn,
  allordersfn,
  userProfilefn,
  userAddressfn,
  forgetpage1fn,
  forgetpage2fn,
  forgetpage4fn,
  insertUser,
  forgetpage3fn
  ,sign2login
  ,landingPagefn
  ,logoutfn
  ,loginPagefn,
  signupPagefn,
  Existemailfn,
  optVerify,
  productCategoryfn}

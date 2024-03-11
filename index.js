const express = require("express")
const session = require("express-session")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
app.use(express.static(path.join(__dirname,"Public")))
const userRouter = require("./Router/userRouter.js")
const adminRouter = require("./Router/adminRouter.js")
const morgan = require("morgan");


app.set("view engine","ejs")
 
// to read info through req in json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req,res,next)=>{
  res.set("Cache-Control","no-store")
  next()
})

//logger
//app.use(morgan("dev"));
//express-session middleware insertion

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

//calling DB fn to conn in starting stage
const DBconnect = require("./config/dbconnect.js")
DBconnect()

app.use(userRouter)
app.use("/admin",adminRouter)

app.listen(3030,()=>{
 console.log("Server is running in port 3030")
})
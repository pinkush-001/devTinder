const express = require("express");
const connectDB = require ("./config/database");
const cookieParser = require ("cookie-parser");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use ("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB().then(()=>{
   console.log("database connection established...");

app.listen(PORT , ()=>{
    console.log("server is successful listening");
});

}) .catch((err)=>{
    console.log("database cannot be connected");
});



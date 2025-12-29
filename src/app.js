const express = require("express");

const app = express();

app.use("/user",(req, res,next)=>{

    // res.send("route handler 1");
    next();

}, (req,res,next)=>{

    // res.send("second response");

    next();


},(req,res)=>{
    res.send("3 route handler");
});

app.listen(3000 , ()=>{
    console.log("server is successful listening");
});

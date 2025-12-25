const express = require("express");

const app = express();

app.use("/hello",(req,res)=>{
    res.send("hahahhahhahahha");
});

app.use("/test",(req,res)=>{
    res.send("hello from the server");
});

app.use("/home", (req,res)=>{
    res.send("welcome to home page");
});

app.listen(3000 , ()=>{
    console.log("server is successful listening");
});

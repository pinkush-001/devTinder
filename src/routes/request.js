const express = require ("express");
const requestRouter = express.Router();
const userAuth= require("../middlewares/auth");
const User = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest");
const { Connection } = require("mongoose");


requestRouter.post ("/request/send/:status/:toUserId",userAuth,async (req,res)=>{

try{    
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignore", "interested"];
    if(!allowedStatus.includes(status)){

       return res.status(400).json({message:"status is not valid"});
    };

    const toUser = await User.findById({_id:toUserId});
    if(!toUser){
        return res.status(400).send("user not found");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId: fromUserId},
        ],
    });

    if (existingConnectionRequest){
        return res.status(400).send("connection request is allready exist");
    };


    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    });

    const data = await connectionRequest.save();
    return res.send("connection request send successfully");
   
    
 }catch (err){
   return res.status(400).send("error" + err.message);
}

});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
try{
    const loggedInUser = req.user;

const {status,requestId} = req.params;

const allowedStatus= [ "accepted", "rejected"]

if(!allowedStatus.includes(status)){
    return res.status(400).send("status is not valid");
}

const connectionRequest = await ConnectionRequest.findOne({
    _id : requestId,
    toUserId : loggedInUser._id,
    status : "interested",
});

if(!connectionRequest){
 return res.status(400).send("connection request not found");
};

connectionRequest.status = status;

const data = await connectionRequest.save();

return res.status(200).send("connection request "+ status);

}catch(err){
    res.status(404).send("error "+ err.message);
}
});

module.exports = requestRouter;
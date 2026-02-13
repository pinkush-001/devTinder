const express = require ("express");
const profileRouter = express.Router();
const userAuth = require ("../middlewares/auth");
const {validateEditProfileData}= require("../utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user")

profileRouter.get ("/profile/view",userAuth, async (req ,res)=> {

   try{
    const user = req.user;
    res.send(user);

   } catch(err){
    res.status(404).send("Error:"+ err.message);
   }

});

profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{

   try{
      if(!validateEditProfileData(req)) {
      throw new Error ("invalid edit request");
      }

      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key) =>(loggedInUser[key]=req.body[key]));

      await loggedInUser.save();

      res.json({
         message:`${loggedInUser.firstName},your profile edit successfully`,
         Data:loggedInUser,
      });
   
   } catch(err){
      res.status(400).send("Error"+ err.message);
   }

});

profileRouter.post("/profile/forgot-password",async (req, res)=>{

   try{
      const {emailId} = req.body;
      const user= await User.findOne({emailId});


      if(!user){
         throw new Error ("user not found")
      }

   const resetToken = await jwt.sign({userId:user._id},
       process.env.JWT_SECRET,{expiresIn:"15m"}); 

      
      user.resetToken=resetToken;
      user.resetTokenExpiry = Date.now() + 15 * 60 * 1000 ;

      await user.save();

      res.json({

         message:"reset token successfully",
         token:resetToken});

   }catch(err){
      res.status(400).json({ message:"server Error"});
   }

});


profileRouter.post("/profile/reset-password/:token", async (req , res)=>{
try{
      const {token} = req.params;
   const {newPassword} = req.body;

   const decoded = await jwt.verify(token, process.env.JWT_SECRET);

   const user = await User.findOne({
      _id : decoded.userId,
      resetToken:token,
      resetTokenExpiry:{$gt: Date.now()}
   });

   if(!user)return res.status(400).json({message:"invalid token"});

   const hashedPassword = await bcrypt.hash(newPassword,10);

   user.password=hashedPassword;
   user.resetToken = undefined;
   user.resetTokenExpiry = undefined;

   await user.save();

   res.json({
      message:"password reset successfully",});
}catch(err){

   res.status(400).json({erroe:err.message});
}

})
    


module.exports = profileRouter;

const express  = require ("express");
const authRouter = express.Router();
const { validateSignUpData} = require ("../utils/validation");
const bcrypt = require ("bcrypt");
const User = require ("../models/user")


 authRouter.post("/signup", async (req, res) => {

    try{

        validateSignUpData(req);
        const {firstName, lastName, emailId ,password} = req.body;

        // encrypt the password

         const passwordHash = await bcrypt.hash(password, 10);


        // create a new instance of the user model

        const user = new User ({
            firstName, lastName, emailId, password:passwordHash,
        });

    
        await user.save();
        res.send( "Data save in the database" );



    }catch(err){
        res.send("Error:"+ err.message);
    }
        
});


authRouter.post("/login",async (req,res) =>{

try{
 const {emailId, password} = req.body;

    const user = await User.findOne({emailId : emailId});

    if (!user){
        throw new Error ("invalid credentials");
        }
    const isPasswordValid=await user.validatePassword(password);

    if (isPasswordValid){


        const token = await user.getjwt();

        res.cookie ("token",token);

        res.send("login successfully");
    }else{
        throw new Error ("invalid credential");
    }
}catch(err){
    res.status(404).send("Error:"+ err.message);
}

});

authRouter.post("/logout", async (req, res)=>{
    res.cookie("token",null,{
      expires:new Date(Date.now()),
    });

    res.send("logout successfully");
});

module.exports= authRouter;
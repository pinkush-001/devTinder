const mongoose = require("mongoose");



const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested","ignore","accepted","rejected"],
            message:`{Value} is incorrect status type`,
        },           
        
    }
  },
  {timestamps:true}
);
connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true});

connectionRequestSchema.pre("save",function (){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
       throw new Error ("cannot sent connection request to yourself");
        
    }
    
    
});

const ConnectionRequest =  mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
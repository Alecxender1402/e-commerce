import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({    
    email : {
        type: String,
        required: true,
        unique: true
    },
    otp:{
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: ()=> new Date(new Date() + 5*60*1000),
        index: { expires: '5m' }, 
    
    }    
});

const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;
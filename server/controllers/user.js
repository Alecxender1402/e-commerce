import OTP from "../models/otp.js";
import User from "../models/user.js";
import sendotp from "../utils/sendOtp.js";
import trycatch from "../utils/trycatch.js";
import jwt from "jsonwebtoken";

export const loginuser = trycatch(async (req, res) => {

    const {email} = req.body;

    const subject = 'Ecommerce APP';

    const otp = Math.floor(100000 + Math.random() * 900000);

    const prevotp = await OTP.findOne({
       email,
    });

    if(prevotp){
        await prevotp.deleteOne();
    }

   await sendotp(email, subject, otp);

   await OTP.create({
        email,
        otp,
    });

    res.status(200).json({message: "OTP sent successfully"});

});

//otp verification

export const verifyUser = trycatch(async (req, res) => {

    const {email, otp} = req.body;

    const otpdata = await OTP.findOne({
        email,
        otp,
    });

    if(!otpdata){
       return res.status(400).json({message: "Invalid OTP"});
    }

    let user = await User.findOne({
        email,
    });

    if(user){
       const token = jwt.sign({
        _id: user._id,
       },
       process.env.JWT_SECRET,
       {
           expiresIn: "1d",
       }
       );

       await otpdata.deleteOne();

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user,
        });
    }
    else{
        user = await User.create({
            email,
        });

        const token = jwt.sign({
            _id: user._id,
           },
           process.env.JWT_SECRET,
           {
               expiresIn: "1d",
           }
           );

           await otpdata.deleteOne();

            res.status(200).json({
                message: "User logged in successfully",
                token,
                user,
            });
    }
});

//profile

export const myprofile = trycatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.status(200).json(user);
})
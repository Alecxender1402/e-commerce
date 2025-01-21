import jwt from "jsonwebtoken";
import User from "../models/user.js";

 const isAuth = async(req,res,next) => {
    try{

        const {token} = req.headers;

        if(!token){
            return res.status(400).json({message: "Please login first"});
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(user._id);

        next();

    }
    catch(error){
        res.status(500).json({message: "please login first"});
        console.log(error);
    }
}

export default isAuth;

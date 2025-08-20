import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const isAuthenticated = async(req,res,next)=>
{
   const {token} = req.cookies;
   if(!token)
   {
     res.status(401).json({message:"User is not Login."})
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!decode)
        {
       res.status(500).json({message:"Token verification failed. Please sign in again."})
   }
    const user = await User.findById(decode.id);
    req.user = user;
    next();
}
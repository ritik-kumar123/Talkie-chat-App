import validator from "validator"
import bcrypt from "bcryptjs"
import { User } from "../models/user.models.js";
import { generateToken } from "../utils/JwtToken.js";
import {v2 as cloudinary} from "cloudinary";
export const signup =async(req,res)=>{
    try{
    const {fullName , email , password} = req.body;
    if(!fullName ||! email || !password)
    {
        return res.status(400).json({
            success: false,
            message: "Please provide complete details.",
        })
    }
    let existUser= await User.findOne({email})
    if(existUser){
    return res.status(400).json({message:"email already exist"})
    }
    if(!validator.isEmail(email))
        {
      return res.status(400).json({message:"Please enter valid Email"})
       }
      if(password.length < 8)
    {
         return res.status(400).json({message:"Please enter a Strong Password"})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        fullName,
        email,
        password:hashedPassword,
        avatar:{
            public_id: "",
            url: "",
        }
    });
    generateToken(user,"User registered successfully",201,res)
}
catch(error)
{
    res.status(500).json({message:`singup error ${error}`})
}
};
export const signin = async(req,res)=>{
     try {
        let {email,password}= req.body
          if ( !email || !password) {
            return res.status(400).json({
              success: false,
              message: "Please provide email and password.",
            });
          }
        let user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid email and password"})
        }
        let isMatch =await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid email and password"})
        }
        generateToken(user, "User logged in Successfully", 200, res);
    }
        catch(error)
        {
        res.status(500).json({ message: `singin error ${error}` });
        }
};
export const signout = async(req,res,next)=>{
     try {
       await res.clearCookie("token");
       return res.status(200).json({ message: "logOut Successfully" });
     } catch (error) {
       return res.status(500).json({ message: `logout Error ${error}` });
     }
};
export const getUser = async(req,res,next)=>{
    try {
        const user = await User.findById(req.user).select("-password");
        res.status(200).json({user})
        
    } catch (error) {
        return res.status(500).json({message:`getUser Error ${error}`});
    }
};
export const updateProfile = async(req,res,next)=>{
    try {
        const {fullName,email} = req.body
        console.log(fullName.length);
        
        if(!fullName || !email)
        {
            return res.status(400).json({
                message:"Fullname and Email can't be empty."
            })
        }
        const avatar = req?.files?.avatar;
        let cloudinaryResponse ={};
        if(avatar)
        {
                const oldAvatarPublicId = req.User?.avatar?.public_id;
                if(oldAvatarPublicId && oldAvatarPublicId>0)
                {
                    await cloudinary.uploader.destroy(oldAvatarPublicId);
                }
                cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath,{
                    folder:"CHAT_APP_USERS_AVATARS",
                    transformation:[
                           { width:300,height:300,crop:"limit"},
                           {quality:"auto"},
                           {fetch_format:"auto"},
                    ],
                })
           
        }
        let data = {fullName,email}
     if(avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url)
    {
        data.avatar=
        {
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        }
    }
    let user = await User.findByIdAndUpdate(req.user._id,data,{new:true,runValidators:true}).select("-password")
    res.status(200).json({
        message:"Profile updated successfully.",
        user
    })
    } catch (error) {
       return res.status(500).json({message:"Failed to upload avatar. Please try again later."})
    }
    
};
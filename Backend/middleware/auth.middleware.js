import jwt from "jsonwebtoken"
import User from "../models/auth.model.js"

export const protectroutes=async(req,res,next)=>{
    try{
    const token=req.cookies.jwt;
    
   if(!token){
     return res.status(400).json({message:"Unauthorized User"});
   }

   const decoded=jwt.verify(token,process.env.JWT_SECRET);
   
   if(!decoded){
    return res.status(400).json({message:"Invalid token"});
   }
   const user=await User.findById(decoded.userId).select("-password");

   if(!user){
   return res.status(400).json({message:"User not found"});
   }
   
   req.user=user;
  
    next();

}catch(err){
    res.status(500).json({message:"Server issue",err});
}

}
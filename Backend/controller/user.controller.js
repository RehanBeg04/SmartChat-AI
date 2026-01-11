import User from "../models/auth.model.js";
import {v2 as cloudinary}  from "cloudinary";



export const fetchprofile=async(req,res)=>{
  try{
    const {id}=req.params;
    const user=await User.findById(id).select("-password").limit(5);
  return res.status(200).json(user);
    
  }catch(err){
    res.status(500).json({message:"Internal Server Error",err});
  }
}
export const Editprofile=async(req,res)=>{
 try{
const userId=req.user._id;
 const {Fullname,bio,email}=req.body;
 let {profilepic}=req.body;

   
   const user=await User.findById(userId);
   if(profilepic){
    if(user.profilepic){
     const parts=user.profilepic.split("/");
     const filewithExt=parts.pop();
     const folder=parts.pop();
     const filename=filewithExt.split(".")[0];
     await cloudinary.uploader.destroy(`${folder}/${filename}`);
    }
   const uploaderesponse=await cloudinary.uploader.upload(profilepic,{
    folder:"chatImages"
   });
   profilepic=uploaderesponse.secure_url;
   }

user.Fullname=Fullname||user.Fullname;
user.bio=bio||user.bio;
user.email=email||user.email;
user.profilepic=profilepic||user.profilepic;
 
 await user.save();

 res.status(200).json({
  message:"Profile Updated Successfully",
  user

 })
  }catch(err){
    res.status(500).json({message:"Internal Server Error",err});
  }

}
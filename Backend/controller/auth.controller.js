
import User from "../models/auth.model.js"
import bcryptjs from "bcryptjs"
import { generatetoken } from "../utils/utils.js";



export const Signup=async(req,res)=>{

    const {Fullname,email,password}=req.body;

    try{

    if(!Fullname,!email,!password){
        return res.status(401).json({
            message:"Please Enter required data"
        })
    }

  if(password.length<6){
    res.status(400).json({
        message:"Please Create a Strong password"
    })
  }

    const existinguser=await User.findOne({email});

    if(existinguser){
        res.staus(400).json({
            success:false,
            message:"User Already exists"
        })
    }

    const Salt=await bcryptjs.genSalt(10);

    const hashedpassword=await bcryptjs.hash(password,Salt);

    const newUser=new User({
        Fullname,
        email,
        password:hashedpassword
    })

    if(newUser){
      generatetoken(newUser._id,res);
      await newUser.save();

      res.status(200).json({
        Fullname:newUser.Fullname,
        email:newUser.email,
        password:newUser.password,
        profilepic:newUser.profilepic
      })
    }else{
        res.status(400).json({
            message:"Invalid user data"
        })
    }
}catch(err){
    res.status(500).json({message:"Internal Server error"});

}
}

export const Login=async(req,res)=>{
    const{email,password}=req.body;
try{
    const user=await User.findOne({email});

    if(!user){
    return res.status(404).json({message:"User doesnt exist"});
    }

   const ispasswordcorrect=await bcryptjs.compare(password,user.password);

   if(!ispasswordcorrect){
   return res.status(404).json({
        message:"Your password is incorrect",
    })
   }

   generatetoken(user._id,res);
   res.status(200).json({
    message:"User Logged in Successfully",
    user
   });

}catch(err){
    res.status(500).json({message:"Internal Server error"});
}



}

export const Logout=async(req,res)=>{
   try{
    res.cookie("jwt","",{
        maxAge:0
    });

    res.status(200).json({
        message:"User Logged out Successfully",
    })
   }catch(err){
    res.status(500).json({message:"Internal Server Error"});

   }

}


export const checkauth=async(req,res)=>{
    try{
       return res.status(200).json(req.user)

    }catch(err){
    res.status(500).json({message:"Internal Server Error"});

    }
}

export const fetchusers=async(req,res)=>{
    try{
   const {Fullname}=req.query;
   const users=await User.find({Fullname:new RegExp(Fullname,"i")}).limit(5).select("Fullname bio profilepic _id");
   return res.status(200).json({
    message:"User Fetched Successfully",
    users
   })

    }catch(err){
    res.status(500).json({message:"Internal Server Error",err});
    }
}

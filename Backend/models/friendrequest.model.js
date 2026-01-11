import mongoose from "mongoose";


const friendlistSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    status:{
        type:String,
        enum:["Pending","Accepted","Declined"],
        default:"Pending",
    }
},{timestamps:true})

export const Friendlistmodel=mongoose.model("Friendlistmodel",friendlistSchema);
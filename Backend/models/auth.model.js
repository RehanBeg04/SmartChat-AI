import mongoose from "mongoose"


const userSchema=new mongoose.Schema({
    Fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true,
        unique:true,
        minlength:6

    },

    profilepic:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },

    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]
},{timestamps:true});


const User=mongoose.model("User",userSchema);

export default User;






import mongoose from "mongoose"

export const connectDB=async()=>{
    try{
    const cunn=await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb Connected: ${cunn.connection.host}` )
    }catch(err){
        console.log("Failed to connect",err);

    }
     
}
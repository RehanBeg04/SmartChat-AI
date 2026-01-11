import {create} from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

const client=axios.create({
    baseURL:"https://smartchat-ai-f36x.onrender.com",
    withCredentials:true
})


export const MessageStore=create((set,get)=>({

sendMessage:async(message,image,receiverId)=>{
  try{
    const res=await client.post("/api/messroute/send",{
        message,image,receiverId
    })
    return res.data
  }catch(err){
    toast.error(err.respnse.data.message);
  }
},

getMessage:async(getmessageId)=>{
try{
    const res=await client.get(`/api/messroute/${getmessageId}`);
    return res.data;
}catch(err){
toast.error(err.response.data.message);
}
},

markasSeen:async(messId)=>{
  try{
    const res=await client.put(`/api/messroute/markasseen/${messId}`)
  }catch(err){
    toast.error(err.response.data.messages);
  }
},

deleteMessage:async(messageId)=>{
  try{ 
  await client.get(`/api/messroute/deletemess/${messageId}`)
  }catch(err){
    toast.error(err.response.data.message);
  }
},

deleteformeMessage:async(messageId)=>{
  try{
    await client.get(`/api/messroute/deletemessforMe/${messageId}`);
  }catch(err){
    toast.error(err.response.data.message);
  }
}

}))


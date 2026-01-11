import {create}  from "zustand";
import axios from "axios"
import { toast } from "react-toastify";

const client=axios.create({
    baseURL:"http://localhost:5001",
    withCredentials:true
})

export const  freindsStore=create((set,get)=>({

 sendreq:async(userId)=>{
    try{
       const res=await client.post(`/api/sendreq/${userId}`);
       toast.success(res.data.message);
       return res.data;
    }catch(err){
    toast.error(err.response.data.message);
    console.log(err);
    }
 },

 acceptreq:async(userId)=>{
    try{
    const res=await client.post(`/api/acceptreq/${userId}`);
     toast.success(res.data);
    }catch(err){
      toast.error(err.response.data.message);
    }
 },

 declinereq:async(userId)=>{
    try{
   console.log(userId);
   await client.post("/api/declinereq",{userId});
    }catch(err){
    toast.error(err.response.data.message);
    }
 },

 incomingreq:async()=>{
     const res=await client.get("/api/incomereq");
      return res.data;
 },

 outgoingreq:async()=>{
   const res=await client.get("/api/outgoingreq");
   toast.success(res.data.message);
      return res.data;
 },
 acceptreq:async(requestId)=>{
 try{
   const res=await client.post("/api/acceptreq",{requestId});
   toast.success(res.data.message);
   return res.data.message;
 }catch(err){
   toast.error(err.response.data.message);
 }
 },
 declinereq:async(receiverid)=>{
  try{
  const res=await client.post("/api/declinereq",{receiverid});
  toast.error(res.data.message);
  return res.data.message;
  }catch(err){
  toast.error(err.response.data.message);
  }
 }
}))

import { createContext, useEffect, useState} from "react";
import axios from "axios"

export const Authcontext=createContext({})
 

 const client=axios.create({
    baseURL:"http://localhost:5001",
    withCredentials:true
})


 export const Authprovider=({children})=>{
    const authcontext=useState(Authcontext);
    const [userdata,setUserdata]=useState(authcontext);
    const [unseenMessages,setUnseenMessages]=useState({});
  

    const loginform=async(email,password)=>{
        const req=await client.post("/api/auth/Login",{
            email,password
        })
        if(req.status){
        return req;
        }
    }
   const signupform=async(Fullname,email,password)=>{
    try{
        const req=await client.post("/api/auth/signup",{
            Fullname,
            email,
            password
        })

    }catch(err){
        throw err;

    }
   }

   const logout=async()=>{
    try{
     const res=await client.get("/api/auth/logout");
      return res;
    }catch(err){
       throw err;
    }
      
   } 

   const checkuser=async()=>{

    const res=await client.get("/api/auth/check");
         return res.data;
   }
  

  const fetchusers=async(query)=>{
    const res=await client.get(`/api/auth/fetchusers?Fullname=${query}`)
    return res.data.users
   }

   const editprofile=async(profilepic,Fullname,bio,email)=>{
     try{
    const res=await client.put("/api/update",{
    profilepic,
    Fullname,
    bio,
    email
  },{
        headers: {
          "Content-Type": "application/json",
        },
  body:JSON.stringify({
  profilepic
  })
   })
  return res.data;
     }catch(err){
        console.log(err);

     }
   }
 const getfriends=async()=>{
    try{
        const res=await client.get("/api/messroute/friends");
        setUnseenMessages(res.data.Unseenmessages);
        return res.data;
        
    }catch(err){
   console.log(err);
    }
 }
 const fetchprofile=async(id)=>{
  try{
  const res=await client.get(`/api/fetchprofile/${id}`);
   return res.data;

  }catch(err){
    console.log(err);
  }
 }

 const deletefriendapi=async(id)=>{
  try{
    const res=await client.get(`/api/deletefriend/${id}`);
    return res;
  
  }catch(err){
    console.log(err);
  }
 }

    const data={
        loginform,signupform,userdata,setUserdata,checkuser,logout,fetchusers,getfriends,
        editprofile,fetchprofile,deletefriendapi,unseenMessages,setUnseenMessages
    }

return  <Authcontext.Provider value={data}>
           {children}
      </Authcontext.Provider>
}

import { createContext, useContext } from "react";
import {io}  from "socket.io-client";
import { Authcontext} from "./Authcontext";
import { useEffect } from "react";
import { useState } from "react";



export const Socketcontext=createContext();

export const Socketcontextprovider=({children})=>{
    const[socket,setSocket]=useState("");
    const [onlineusers,setOnlineusers]=useState([]);
const {userdata}=useContext(Authcontext);




useEffect(()=>{
  if(userdata){
   const newsocket=io("https://smartchat-ai-f36x.onrender.com",{
    query:{userId:userdata._id },
    withCredentials:true
  }) 

  setSocket(newsocket);

  newsocket.on("getOnlineuser",(user)=>{
    setOnlineusers(user);
  })

 
return ()=>newsocket.close();
 }else{
    if(socket){
        socket.close();
        setSocket(null);
    }
 }

},[userdata])

return (
   <Socketcontext.Provider  value={{socket,onlineusers}}>
       {children}
   </Socketcontext.Provider>
)

}
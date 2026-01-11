import React, { useContext } from 'react'
import { Authcontext } from '../context/Authcontext'
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { Socketcontext } from '../context/SocketContext';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function Userprofile() {
    let {id}=useParams();
    const [user,setUser]=useState({});
    const [day,setDay]=useState(null);
    const [month,setMonth]=useState(null);
    const [year,setYear]=useState(null);
    const {fetchprofile,deletefriendapi}=useContext(Authcontext);
    const navigate=useNavigate();
   
   useEffect(()=>{
    const fetchuser=async()=>{
        try{
      const res=await fetchprofile(id);
      setUser(res);
        }catch(err){
     console.log(err);
        }
    }
    fetchuser();
  },[])

    useEffect(()=>{
        formatTime(user.createdAt);
    })

    const formatTime=(data)=>{
        const date=new Date(data);
        setDay(String(date.getDate()).padStart(2,'0'));
        setMonth(String(date.getMonth()+1).padStart(2,'0'));
        setYear(date.getFullYear());
        
      }
   const handledeletefriend=async()=>{
    const res= await deletefriendapi(user._id);
     socket.on("deleteuser",(message)=>{
      if(message){
        console.log(message);
        setUser(null);
        navigate("/chat");
      }
    })
    if(res){
     navigate("/chat");
    }
   }
    
    
  return (
    <div  className='flex flex-col justify-center items-center h-screen bg-gray-900 relative p-4'>
       <div className='absolute top-0 right-0 bg-red-700 px-1'>
       <IconButton onClick={()=>{navigate("/Chat")}}>
       <CloseIcon/>
       </IconButton>
        </div>
        <div className='bg-gray-400 p-4 rounded-xl  text-center'>
        <div className="flex  items-center gap-4 border-b-1 border-gray-500 pb-4 ">
      <div className=" realtive rounded-full overflow-hidden  object-cover w-18 h-18 border-1 border-black ml-4">
        <img
          src={user?.profilepic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s"}
          alt="Profile"
          className=" w-full h-full  bg-gray-300  "
        />
      </div>
       <div className="Profilecont ">
        <h2 className="text-2xl font-semibold text-gray-800">{user?.Fullname}</h2>
    </div>

    </div>
   
   <div className="profilecont flex flex-col  gap-4 ">
     <div className="Bio py-3">
      <p className=" mt-2  text-xl text-gray-800">
         <span>Bio:-</span>{user?.bio||"Hey There I am Using ChatApp"}
        </p>
     </div>

     <div className="email py-3 text-xl text-gray-800">
       <p>Email:-<span></span>{user?.email}</p>
     </div>
   <div className="Joined text-xl text-gray-800">
    <p>Joined Since:{day}-{month}-{year}</p>
   </div>
   <div className="buttons flex gap-4 justify-center mt-10">
    <button className="mt-2 px-3 py-2 text-nowrap bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      onClick={handledeletefriend}>Delete User</button>
   </div>
   </div>
   </div>
    
    </div>

  )
}

export default Userprofile

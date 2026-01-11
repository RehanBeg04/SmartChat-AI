import React, { useContext } from 'react'
import { Authcontext } from '../context/Authcontext'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

const ProfileCard=React.memo(({user,onEdit})=>{
  const [day,setDay]=useState("");
  const [month,setMonth]=useState("");
  const [year,setYear]=useState("");
  const {logout}=useContext(Authcontext);
  const navigate=useNavigate();

  const logoutuser=async()=>{
     await logout();
    navigate("/auth");
  }

  const formatTime=(data)=>{
    const date=new Date(data);
    setDay(String(date.getDate()).padStart(2,'0'));
    setMonth(String(date.getMonth()+1).padStart(2,'0'));
    setYear(date.getFullYear());
  }
  useEffect(()=>{
    formatTime(user.createdAt);
  },[])
  return (
    <div>
        <div className="flex  items-center gap-4 border-b-1  border-gray-500  pb-4  ">
      <div className=" realtive rounded-full overflow-hidden  object-cover w-20 h-20 border-1 border-black ml-4">
        <img
          src={user?.profilepic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s"}
          alt="Profile"
          className=" w-full h-full  bg-gray-300  "
        />
      </div>
       <div className="Profilecont ">
        <h2 className=" text-2xl md:text-2xl font-semibold text-gray-800">{user?.Fullname}</h2>
    </div>

    </div>
   
  <div className="profilecont flex flex-col  gap-2">
     <div className="Bio py-1 ">
      <p className=" mt-2 text-xl md:text-2xl text-gray-800">
        Bio:-{user?.bio||"Hey There I am Using ChatApp"}
        </p>
     </div>

     <div className="email py-3 ">
      <p className="text-xl md:text-2xl text-wrap text-gray-800">
         Email:-{user?.email}
        </p>
     </div>
   <div className="Joined text-xl md:text-2xl text-gray-800">
    <p>Joined Since:{day}-{month}-{year}</p>
   </div>
    <div className='flex gap-4 justify-center mt-4'>
       <button className="px-4 py-2 text-nowrap bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" onClick={onEdit}>Edit profile</button>
    <button className=" px-4 py-2 text-nowrap bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" onClick={logoutuser}>Logout</button>
   </div>
    
      
    </div>
    </div>
  )
})

export default ProfileCard

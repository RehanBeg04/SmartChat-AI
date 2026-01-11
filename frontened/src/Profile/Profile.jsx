import React, { useEffect } from 'react'
import ProfileCard from './ProfileCard';
import Editprofile from './Editprofile';
import { useState,useContext} from 'react';
import { Authcontext } from "../context/Authcontext";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

function Profile() {
  
   const { userdata,setUserdata} = useContext(Authcontext); 
  const [isEditing, setIsEditing] = useState(false);
  const navigate=useNavigate();
  const handleedit=useCallback(()=>{
     setIsEditing(true);
  },[])
  
  if (!userdata) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 relative p-4">
       <div className='absolute top-0 right-0 bg-red-800 '>
       <IconButton onClick={()=>{navigate("/Chat")}}>
       <CloseIcon/>
       </IconButton>
        </div>
       <div className=" max-w-md bg-gray-400 rounded-2xl p-6  shadow-md text-center">
        <ProfileCard user={userdata} onEdit={handleedit} />
      </div>

      {isEditing && (
        <Editprofile   onClose={()=>setIsEditing(false)}/>
      )}
    </div>

  )
}

export default Profile

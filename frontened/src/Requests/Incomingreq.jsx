import React, { useContext, useEffect, useState } from 'react'
import DangerousIcon from '@mui/icons-material/Dangerous';
import CheckIcon from '@mui/icons-material/Check';
import { freindsStore } from '../store/FreindreqStore';
import { Authcontext } from '../context/Authcontext';
import IconButton from '@mui/material/IconButton';

const Incomingreq=React.memo(({showreq})=>{
  const {incomingreq,acceptreq,declinereq}=freindsStore();
  const [incomreq,setIncomreq]=useState([]);


  useEffect(()=>{
   const fecthincomereq=async()=>{
    const res=await incomingreq();
      if(res){
    setIncomreq(res);
      }
   }

   fecthincomereq();
  },[])

  const acceptfreindreq=async(requestId)=>{
      const res=await acceptreq(requestId);
      setIncomreq(prev=>prev.filter((m)=>m._id!==requestId))
  }

  const handledeclinereq=async(requestId)=>{
    try{
    const res=await declinereq(requestId);
    setIncomreq(prev=>prev.filter((m)=>m._id!==requestId))
    }catch(err){
      console.log(err);
    }
  }
  
  return (
    <div className={`md:w-[35vmax] w-full bg-gray-700 h-full rounded-md my-1
     ${showreq?"hidden":"flex"} md:flex flex-col gap-2 `} >
     <h1 className=' text-xl md:text-2xl p-4 text-slate-200 '>Incoming Requests:-</h1>
      <div className="users  p-1 md:px-5 overflow-y-auto [&::-webkit-scrollbar]:hidden ">
        {
          incomreq.length==0  && <p className='text-2xl text-slate-200'>No requests are Found !</p>
        }
        {
      incomreq?.map((i)=>{        
   return <div className="user1 flex items-center justify-between gap-4  bg-gray-400 border-gray-600 text-black px-2 md:px-5  rounded-sm" key={i._id}>
        <div className="userprofile h-16 w-16 rounded-full overflow-hidden flex-shrink-0  bg-blue-900">
          <img src={i.receiver.profilepic||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&"} className='h-full w-full '></img>
        </div>
         <div className="userinfo">
        <h1 className='text-gray-800 font-medium text-xl md:text-2xl'>{i.sender.Fullname}</h1>
     </div>
     <div className="reqicons flex items-center gap-3">
        <div className="accept border-1 border-gray-800 p-1 rounded-full hover:bg-gray-500">
            <IconButton onClick={()=>acceptfreindreq(i._id)}>
              <CheckIcon/>
            </IconButton>
        </div>
        <div className="decline border-1 border-gray-800 p-1 rounded-full hover:bg-gray-500">
          <IconButton onClick={()=>{handledeclinereq(i._id)}}>
          <DangerousIcon/>
          </IconButton>
        </div>
     </div>
     </div>
      })
         }
     </div> 
    </div>
  )
})

export default Incomingreq

import React from 'react'
import { freindsStore } from '../store/FreindreqStore';
import { useEffect } from 'react';
import { useState } from 'react';

const Outgoing=React.memo(({showreq})=>{
  const {outgoingreq}=freindsStore();
  const [outgoinguser,setOutgoinguser]=useState([]);


  useEffect(()=>{
  const fetchoutgoingreq=async()=>{
    try{
      const res=await outgoingreq();
      if(res){
    setOutgoinguser(res);
      }
    }catch(err){
      console.log(err);
    }
  }
  fetchoutgoingreq();
  },[])

  return (
     <div className={`md:w-[35vmax]  flex-col w-full h-full rounded-md  bg-gray-700 gap-2 
    ${showreq?"flex":"hidden"} md:flex my-2 `}>
     <h1 className=' text-xl md:text-2xl p-2 text-slate-200'>Outgoing Requests:-</h1>
     <div className="users  p-2 md:px-5 overflow-y-auto [&::-webkit-scrollbar]:hidden ">
      {
        outgoinguser.length==0  && <p className='text-xl md:text-2xl text-slate-200 '>No Request Sent!</p>
      }
      {outgoinguser.map((i)=>{
       return <div className=" user1 flex items-center justify-between gap-4 mt-2 bg-gray-400 border-1 border-gray-600 text-black px-2 md:px-4 overflow-y-auto no-scrollbar  hover:bg-gray-400 rounded-sm" key={i._id} >
        <div className="userprofile h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border-1 border-black  m-2">
          <img src={i.receiver.profilepic||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s"} className='h-full w-full  '></img>
        </div>
         <div className="userinfo">
        <h1 className='text-slate-900 font-medium text-xl md:text-2xl '>{i.receiver.Fullname}</h1>
     </div>
     <div className="reqicons">
       <button className='py-1 rounded-sm px-4 bg-blue-600 text-xl  text-white'>Sent</button>
     </div>
       </div> 

    }) 
} 

    </div>
      
    </div>
  )
})

export default Outgoing

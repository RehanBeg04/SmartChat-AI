import React,{ useContext, useState } from 'react'
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Authcontext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Socketcontext } from '../context/SocketContext';


const Sidepanel=React.memo(({selecteduser,setSelecteduser})=>{
  const [friends,setFreinds]=useState([]);
  const [name,setName]=useState({});
  const [users,setUsers]=useState([]);
  const {userdata,logout,getfriends,unseenMessages,setUnseenMessages}=useContext(Authcontext);
  const {onlineusers}=useContext(Socketcontext);

  const navigate=useNavigate();

  useEffect(()=>{
  const fetchfreinds=async()=>{
   try{
     const res=await getfriends();
     setUnseenMessages(res.Unseenmessages);
     setFreinds(res.user.friends)

    }catch(err){
      console.log(err);
    }
  };
  fetchfreinds();
  },[])

const matchedUsers =()=>{
 const user=friends.filter(friend =>
  friend.Fullname==name
);

setUsers(user);
}
 const logoutuser=async()=>{
    const res=await logout();
    console.log(res);
    navigate("/auth");
  }
  return (
    <div className={`sidepanel transition-all duration-1000  bg-gray-900  border-r border-slate-800
    ${selecteduser?"hidden":"flex"} w-full  md:flex md:w-95 
   `}>

     <div className="sidpanel1 w-20  h-full flex flex-col border-r bg-gray-600 border-gray-800 justify-between py-15 items-center">
      <div className="aboveicons flex flex-col space-y-8 ">
        <ChatIcon sx={{fontSize:"2rem"}}/>
        <AccountCircleIcon sx={{fontSize:"2rem"}} onClick={()=>{navigate(`/profile/${userdata._id}`)}}/>
        <PersonAddIcon sx={{fontSize:"2rem"}} onClick={()=>{navigate("/request")}}/>
      </div>
      <div className="botticons" onClick={logoutuser}>
        <ExitToAppIcon sx={{fontSize:"2rem"}}/>
      </div>
     </div>

     <div className="sidepanel2 w-full flex flex-col ">
      <div className="searchuser absolute rounded-md top-12 left-15 bg-amber-200 m-4 ">
      {users.length > 0 && 
        users.map((user)=>(
        <div className=" user1 flex gap-6  bg-gray-400 border-1 border-black items-center p-1 px-3 rounded-sm" key={user._id} onClick={()=>{setSelecteduser(user); setUnseenMessages(prev=>({...prev,[user._id]:0}))}} >
        <div className="userprofile h-12 w-12 rounded-full border-1  overflow-hidden flex-shrink-0 ">
          <img src={user?.profilepic||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s"} className='h-full w-full'></img>
        </div>
         <div className="userinfo ">
        <h1 className='text-gray-800 font-medium '>{user?.Fullname}</h1>
        <p className=' text-sm text-gray-700'>{user?.bio ||"Hey there I am using chatapp"}</p> 
     </div>
       </div>))
      }
      </div>
      <div className="inputbox flex gap-4 w-full p-4 border-b border-gray-300 pb-5 items-center  justify-center">
        <input type='text' placeholder='Enter a User' className='bg-gray-100 focus:outline-none p-2 border-1 border-black rounded-sm' onChange={(e)=>{setName(e.target.value)}}></input>
      <button className='bg-blue-500 hover:bg-blue-400 text-white  p-1 rounded-sm' onClick={matchedUsers}> Search</button>
      </div>
       <div className="sidpanelusers flex flex-col gap-4 mt-4 px-2 overflow-y-auto scroll-smooth pb-3 ">
        {friends.length==0? <p className='text-gray-400 text-xl text-center px-2'>Make Freinds No Freinds to Show Yet!</p>:
        friends.map((friend)=>{
        return  <div className=" user1 flex  gap-6  bg-gray-400 items-center p-1 px-3 hover:bg-gray-400 rounded-sm" key={friend._id} onClick={()=>{setSelecteduser(friend); setUnseenMessages(prev=>({...prev,[friend._id]:0}))}}
       >
        <div className="userprofile h-12 w-12 rounded-full border-1  overflow-hidden flex-shrink-0 ">
          <img src={friend?.profilepic||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s"} className='h-full w-full'></img>
        </div>
         <div className="userinfo ">
        <h1 className='text-gray-800 font-medium '>{friend?.Fullname}</h1>
        <p className=' text-sm text-gray-700'>{friend?.bio ||"Hey there I am using chatapp"}</p> 
        {onlineusers.includes(friend._id)?<p className='text-gray-700'>Online</p> :<p className='text-gray-500'>Offline</p>}
     </div>
     <div className="unseenmessage ">
      {unseenMessages[friend._id]>0 && <p className='rounded-full h-7 w-7 bg-green-500 text-center  ' >{unseenMessages[friend._id]}</p>}
     </div>
       </div>
        })
}

       </div>
    
       </div>
     </div>
  )
})

export default Sidepanel;

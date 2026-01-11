import React,{ useEffect, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { MessageStore } from '../store/Message.store';
import { Socketcontext } from '../context/SocketContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Authcontext } from '../context/Authcontext';

const  Messagepanel=React.memo(({ selecteduser, setSelecteduser })=>{
  const [messages, setMessages] = useState([]);
  const [selectmess, setSelectmess] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [isdelete, setIsdelete] = useState(false);
  const { sendMessage, getMessage, deleteMessage, deleteformeMessage,markasSeen } = MessageStore();
  const { socket, onlineusers} = useContext(Socketcontext);
  const { userdata,setUnseenMessages } = useContext(Authcontext);

  const bottomRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const getMessages = async (receiverId) => {
      try {
        const res = await getMessage(receiverId);
        setMessages(res.messages);

      } catch (err) {
        console.log(err);
      }
    }
    if(selecteduser._id) {
      getMessages(selecteduser._id);
    }
  }, [selecteduser])

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
    if(selecteduser && newMessage.senderId===selecteduser._id){
       newMessage.seen=true;
       getMessasseen(newMessage._id);
    }else{
      setUnseenMessages((prevUnseenmessage)=>({
      ...prevUnseenmessage,[newMessage.senderId]:
        prevUnseenmessage[newMessage.senderId] ?
        prevUnseenmessage[newMessage.senderId]+1:1
      }))
    }
     setMessages((prev) => [...prev, newMessage]);
    
  
    })

    socket.on("messagedeleted", (messageId) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });

    socket.on("deleteforme", (messageId) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    })

    return () => socket.off("newMessage");
  }, [socket])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const handlesendMessage = async (receiverId) => {
    try {

      if (message !== "undefined" || profilepic !== "undefined") {
        await sendMessage(message, image, receiverId);
        setMessage("");

      }
    } catch (err) {
      console.log(err);
    }
  }

  const handlekeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlesendMessage(selecteduser._id);
    }
  }
  const handledeletemsg = async () => {
    if (!selectmess) return;
    setIsdelete(false);
    await deleteMessage(selectmess._id);
    setSelectmess("");

  }

  const handledeleteformeMessage = async () => {
    if (!selectmess) return;
    await deleteformeMessage(selectmess._id);
    setSelectmess("");
    setIsdelete(false);

  }

  const handleimagechange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      const allowedtypes = ["image/png", "image/jpeg"];
      if (!allowedtypes.includes(file.type)) {
        console.log("This file is not supported");
        return;
      }

      const reader = new FileReader();
      console.log(reader);
      reader.onload = () => {
        setImage(reader.result);
      }
      reader.readAsDataURL(file);

    }
  }
  const getMessasseen=async(messId)=>{
    const res=await markasSeen(messId);
    console.log(res);
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })

  }

  return (
   <div className={`h-full relative bg-gray-900 w-full
      ${selecteduser ? "flex" : "hidden"}
    `}>
      <div className="chatright w-full ">
        {
          isdelete &&
          <div className='bg-gray-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  transition  duration-10 ease-in rounded-md w-80 '>
            <div className="closeicon flex  justify-between p-2">
              <p >Are you want to delete this Message ?</p>
              <CloseIcon onClick={() => { setIsdelete(false) }} />
            </div>
            <div className="buttons flex  flex-col items-end gap-6 my-7 mx-3">
              {selectmess.senderId == userdata._id &&
                <div className="button1  p-1 rounded-sm">
                  <button onClick={handledeletemsg}>Delete From EveryOne</button>
                </div>
              }
              <div className="button2   p-1 rounded-sm ">
                <button onClick={handledeleteformeMessage}>Delete For Me</button>
              </div>
            </div>

          </div>
        }
        <div className="toprightpanel  bg-gray-400 border-b border-gray-800 shadow-md  h-18 flex items-center justify-between">
          <div className="rightpanelimg  h-full flex items-center gap-5 px-2 md:px-4" onClick={() => { navigate(`/userprofile/${selecteduser._id}`) }}>
            <div className="rightimg h-15 w-15 overflow-hidden object-cover border-1 border-black rounded-full">
              <img src={selecteduser.profilepic ||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s"} className='h-full w-full  shrink:0 '></img>
            </div>
            <div className="username">
              <h1 className='md:text-2xl  text-xl text-nowrap text-gray-800 '>{selecteduser.Fullname}</h1>
              {onlineusers.includes(selecteduser._id) ? <p className='mx-3 text-gray-800'>Online</p> : <p className='mx-3 text-gray-800'>Offline</p>}
            </div>

          </div>
          <div className="icons flex md:gap-5 gap-1 justify-between ">
            <IconButton onClick={() => setIsdelete(true)} >
              <DeleteIcon  sx={{fontSize:"1.8rem"}}/>
            </IconButton >
            {
              (!selectmess) ? <IconButton onClick={() => setSelecteduser(null)}>
                <ExitToAppIcon sx={{ fontSize: "1.8rem" }} />
              </IconButton > : <IconButton onClick={() => { setSelectmess("") }} >
                <CloseIcon />
              </IconButton>
            }
          </div>
        </div>


        <div className="chatmessage bg-black  ">
          <div className="chatinput flex  justify-center w-full items-center absolute bottom-2  gap-2 px-6">
            <div className="input border  flex justify-between gap-3  py-3 px-5 rounded-full bg-gray-200 border-t border-gray-500 w-[100%] md:w-[80%] focus:outline-none text-xl focus:ring-0">

              <label htmlFor="image" className="cursor-pointer text-gray-500">
                <InsertPhotoIcon />
              </label>
              <input
                id="image"
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleimagechange}
              />

              <input type='text' placeholder='Type a Message..' className='w-[80%] focus:outline-none focus:ring-0 px-2 text-wrap rounded-sm'
                value={message} onKeyDown={handlekeydown} onChange={(e) => { setMessage(e.target.value) }}>

              </input>
              <button onClick={() => { handlesendMessage(selecteduser._id) }} ><SendIcon /></button>
            </div>
          </div>
        </div>
        <div className="messpanel  rounded-sm flex flex-col space-y-2  p-4 overflow-y-auto h-[calc(100vh-145px)] [&::-webkit-scrollbar]:hidden">
          {
            messages.map((m) => {
              if (m.deletedFor?.includes(userdata._id)) {
                return null;
              }

              if (
                m.isAi === true &&
                m.visibleTo === userdata._id &&
                m.senderId !== userdata._id
              ) {
                return null;
              }

              if (m.isAi && m.senderId === userdata._id) {
                return <div
                  key={m._id}
                  // className={`flex ${m.senderId !== selecteduser._id ? "justify-end" : "justify-Start"
                  //   }`}
                  onClick={() => { setSelectmess(m) }}
                  className={`message-bubble ${selectmess._id === m._id ? "selected" : ""}  bg-gray-200 max-w-52 text-slate-800 border border-indigo-400 rounded-lg px-4 py-2 `
                  }
                >
                  <span className="text-xs text-indigo-600 font-semibold">AI Assistant</span>
                  <p className='text-wrap'>{m.message || <img
                    src={m.image}
                    className="w-40 rounded-lg"
                    alt="sent"
                  />}</p>
                  <div className="text-[10px] text-right mt-1 opacity-70">
                    <p>{formatTime(m.createdAt)}</p>
                  </div>
                </div>
              } else if (!m.isAi && m.senderId !== m.receiverId) {
                return <div
                  key={m._id}
                  className={`flex ${m.senderId !== selecteduser._id ? "justify-end" : "justify-Start"
                    }`}
                  onClick={() => { setSelectmess(m) }}
                >
                  <div
                    className={`message-bubble ${selectmess._id === m._id ? "selected" : ""}  max-w-52 px-4 py-2 rounded-2xl shadow-md ${m.senderId != selecteduser._id
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                  >
                    <p className='text-wrap'>{m.message || <img
                      src={m.image}
                      className="w-40 rounded-lg"
                      alt="sent"
                    />}</p>
                    <div className="text-[10px] text-right mt-1 opacity-50">
                      <p>{formatTime(m.createdAt)}</p>
                    </div>
                  </div>
                </div>

              }


            })
          }
          <div ref={bottomRef} />
        </div>

      </div>

    </div>
  )
})

export default Messagepanel

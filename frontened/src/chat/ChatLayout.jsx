import { useState } from 'react'
import Sidepanel from './Sidepanel'
import Messagepanel from './Messagepanel'

function ChatLayout() {
 const [selecteduser,setSelecteduser]=useState("");
  return (
    <div className='flex h-screen w-screen'>
      <Sidepanel selecteduser={selecteduser} setSelecteduser={setSelecteduser}  />
      {
        selecteduser ? <Messagepanel selecteduser={selecteduser} setSelecteduser={setSelecteduser} />
          : (
            <div className="md:flex items-center justify-center w-full bg-slate-200 text-gray-500 hidden ">
             <h1 className='text-2xl text-wrap w-fit'> Select a user to start chatting 💬</h1> 
            </div>
          )
      }

    </div>
  )
}

export default ChatLayout

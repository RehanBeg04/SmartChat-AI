import { useState } from 'react'
import Auth from './components/Auth'
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom'
import { Authprovider } from './context/Authcontext'
import Authcheck from './components/Authcheck'
import ChatLayout from './chat/ChatLayout'
import Profile from './Profile/Profile'
import Requests from './Requests/Request'
import Messagepanel from './chat/Messagepanel'
import { ToastContainer } from 'react-toastify';
import { Socketcontextprovider } from './context/SocketContext'
import Userprofile from './Profile/Userprofile'

function App() {
 return(
  <Router>
    <Authprovider>
      <Socketcontextprovider>
         <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <Routes>
      <Route path='/auth'  element={<Auth/>}/>
      <Route path='/chat'  element={<Authcheck><ChatLayout/></Authcheck>}/>
      <Route path='/profile/:id' element={<Authcheck><Profile/></Authcheck>}/>
      <Route path="/message/:id" element={<Messagepanel/>}/>
      <Route path="/request" element={<Authcheck><Requests/></Authcheck>}/>
      <Route path="userprofile/:id" element={<Authcheck><Userprofile/></Authcheck>}/>
       <Route
        path='*'
        element={<Authcheck><ChatLayout/></Authcheck>}
      />
    </Routes>
    </Socketcontextprovider>
    </Authprovider>
    
  </Router>
 )
}

export default App

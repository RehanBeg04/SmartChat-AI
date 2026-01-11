import React, { useContext } from 'react'
import { useState } from 'react';
import { Authcontext } from '../context/Authcontext';
import { useRef } from 'react';
import { toast } from 'react-toastify';

const Editprofile=React.memo(({onClose})=>{
  const profileimageref=useRef(null);
   const [Fullname,setFullname]=useState("");
   const [email,setEmail]=useState("");
   const [profilepic,setProfilepic]=useState(null);
   const [bio,setBio]=useState("");
  const [loading, setLoading] = useState(false);
  const {setUserdata,userdata,editprofile}=useContext(Authcontext)


const handledata=async()=>{
const res=await editprofile(profilepic,Fullname,bio,email);
toast.success(res.message);
setUserdata(res.user);
onClose();
}

const handleimagechange=(e)=>{
 const file=e.target.files[0];
  if(file){
    const allowedtypes=["image/png","image/jpeg"];
    if(!allowedtypes.includes(file.type)){
      console.log("This file is not supported");
      return;
    }

    const reader=new FileReader();
    console.log(reader);
    reader.onload=()=>{
      setProfilepic(reader.result);
    }
     reader.readAsDataURL(file);
   
  }

}
  return (
    <div>
         <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center">
      <div className="bg-gray-400 rounded-xl w-11/12 max-w-md  p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit Profile</h2>

        <input
          type="text"
          value={Fullname}
          onChange={(e)=>setFullname(e.target.value)}
          placeholder={userdata?.Fullname||"Enter name"}
          name='Fullname'
          className="w-full border p-2 rounded mb-3 focus:outline-none text-gray-800"
        />

        <label>
           <input
          type='file'
          onChange={handleimagechange}
          ref={profileimageref}
          accept='image/png,image/jpeg'
          className="w-full border p-2 rounded mb-3 focus:outline-none text-gray-800"
         
        />
        </label>
        <textarea
          value={bio}
          onChange={(e) =>setBio(e.target.value)}
          placeholder={userdata?.bio||"Edit or Update  Bio"}
          className="w-full border p-2 rounded mb-3 focus:outline-none text-gray-800"
        />

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={userdata?.email ||" Edit email"}
          className="w-full border p-2 rounded mb-3 focus:outline-none text-gray-800"
        />



        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-600 hover:text-white"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handledata}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
    </div>
  )
})

export default Editprofile

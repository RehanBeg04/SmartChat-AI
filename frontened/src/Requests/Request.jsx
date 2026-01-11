import React, { useEffect } from 'react'
import Incomingreq from './Incomingreq'
import Outgoing from './Outgoing'
import { useState } from 'react'
import { useContext } from 'react'
import { Authcontext } from '../context/Authcontext'
import { freindsStore } from '../store/FreindreqStore'
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function Requests() {
  const [showreq, setShowreq] = useState(false)
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { fetchusers } = useContext(Authcontext);
  const { sendreq } = freindsStore();
  const navigate = useNavigate();

  useEffect(() => {

    const debouncefnc = setTimeout(() => {
      if (query !== "") {
        fetchuser();
      } else {
        setResults([]);
      }
    }, 500)
    return () => clearTimeout(debouncefnc);

  }, [query])




  const fetchuser = async () => {
    try {
      const res = await fetchusers(query);
      if (!res) {
        console.log("User does not exist");
      }
      setResults(res);
    } catch (err) {
      console.log(err);
    }

  }

  const handlesendreq = async (id) => {
    try {
      await sendreq(id);
      setQuery("");
    } catch (err) {
      console.log(err);
    }

  }



  return (
    <div className='h-screen w-full flex flex-col  bg-gray-900 relative'>
      <div className='absolute right-0 bg-red-800 px-1'>
        <IconButton onClick={() => { navigate("/Chat") }}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="Addfriendreq w-full  flex flex-col items-center p-2  gap-2">
        <div className='md:h-20 flex items-center relative '>
          <input type='text'
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            placeholder='Make New Friends'
            className='focus:outline-0 text-white border-amber-50 border-1 p-2 rounded-sm md:w-100 md:text-2xl'></input>
          {/* <button className='border-1 border-black  px-6 rounded-sm bg-blue-900 text-white'>Add</button> */}

          {results.length > 0 &&
            <ul className="users md:w-100  w-50 bg-gray-400 text-black p-2 shadow rounded-md absolute md:top-28 top-11">
              {results.map((user) => (
                <li
                  key={user._id}
                  className="p-2 hover:bg-gray-300  rounded-sm cursor-pointer flex justify-between"
                >
              <span>{user.Fullname}</span>
                  <button
                    onClick={() => { handlesendreq(user._id) }}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          }
        </div>

      </div>


      <div className="Child w-full flex  md:flex-row flex-col items-center  justify-center h-full  gap-4 p-2">
        <div className="showusers  flex  justify-center w-full  gap-10  border-b-1  border-gray-700 pb-2 md:hidden">
          <button className='border-1 border-black  px-2 py-1 rounded-sm bg-gray-100' onClick={() => { setShowreq(false) }}>Incoming</button>
          <button className='border-1 border-black  px-3 py-2 rounded-sm bg-gray-100' onClick={() => { setShowreq(true) }}>Outgoing</button>
        </div>
        <div className="req w-full  flex justify-center gap-5 m-2 py-2 h-[calc(100vh-160px)]">
          <Incomingreq showreq={showreq} />
          <Outgoing showreq={showreq} />
        </div>

      </div>


    </div>

  )
}

export default Requests

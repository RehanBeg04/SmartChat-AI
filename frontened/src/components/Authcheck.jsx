import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { Socketcontext } from '../context/SocketContext';
import { Authcontext } from '../context/Authcontext';
import { toast } from 'react-toastify';

function Authcheck({ children }) {
    const [isLoading, setIsLoading] = useState(null);
    const { checkuser, userdata, setUserdata } = useContext(Authcontext);


    useEffect(() => {
        const getuser = async () => {
            try {
                const res = await checkuser();
                setUserdata(res);
                setIsLoading(true);
            } catch (err) {
                toast.error(err.response.data.message);
                setIsLoading(false);
            }
        }
        getuser();
    }, [])

    if (isLoading === null) return <p>Authenticating ...</p>

    if (isLoading === false) return <Navigate to="/auth"></Navigate>

    return (
        children
    )
}

export default Authcheck


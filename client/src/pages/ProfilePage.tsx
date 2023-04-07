import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import {  Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const[direct,setRedirect] = useState("")
  const { ready, user,setUser } = useContext(UserContext);
  const location = useLocation();
  const page = location.pathname.split('/')[1]
  console.log(page)

  if (!ready) {
    return <>Loading...</>;
  }

  const logOut = async() => {
    await axios.post('/logout')
    setRedirect("/")
    setUser(null)

  }

  if (!user && ready && !direct) {
    return <Navigate to="/login" />;
  }

  if(direct!== ""){
    return <Navigate to={direct}/>
  }

  
  return (
    <div>
     <AccountNav/>
    {
        page === 'account' && (
            <div className="text-center max-w-lg mx-auto">
                Logged in as {user.name} ({user.email})<br/>
                <button onClick={logOut} className="primary max-w-sm mt-4">Log Out</button>
            </div>
        )
    }

    </div>
  );
}

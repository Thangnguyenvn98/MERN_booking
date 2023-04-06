import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AccountPage() {
  const[direct,setRedirect] = useState("")
  const { ready, user,setUser } = useContext(UserContext);
  const { page } = useParams();

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
      <nav className="flex w-full mt-8 gap-8 justify-center">
      <Link to={'/account/profile'} className={page ==='profile'?'text-white bg-red-400 rounded-full p-3 ':"p-3" }>My Profile</Link>
      <Link to={'/account/bookings'} className={page ==='bookings'?'text-white bg-red-400 rounded-full p-3 ':"p-3" }>My Bookings</Link>
      <Link to={'/account/accomodations'} className={page ==='accomodations'?'text-white bg-red-400 rounded-full p-3 ':"p-3" }>My Applcations</Link>
      </nav>
    {
        page === 'profile' && (
            <div className="text-center max-w-lg mx-auto">
                Logged in as {user.name} ({user.email})<br/>
                <button onClick={logOut} className="primary max-w-sm mt-4">Log Out</button>
            </div>
        )
    }
    </div>
  );
}

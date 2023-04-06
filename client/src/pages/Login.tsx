import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";

export default function LoginPage(){
    const [email,setEmail] = useState("")
    const[password,setPassword] = useState("")
    const [redirect,setRedirect] = useState(false)
    const{setUser} = useContext(UserContext)


    const handleLoginSubmit = async (e:any) => {
     
      e.preventDefault();
      try {
      const {data} = await axios.post("/login", {
      
        email,
        password,
      });
      console.log(data);
      setUser(data)
      toast.success("Login successful!");
      setRedirect(true)
    } catch (error) {
      if (error instanceof AxiosError){
        toast.error(error.response?.data?.message || "Login Failed.")} 
      
    }
  };
    if (redirect){
      return <Navigate to={'/account/profile'}/>
    }


  

    return (
        <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-46">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit} >
          <input type="email"
                 placeholder="your@email.com"
                 value = {email}
                 onChange= {(e)=> setEmail(e.target.value)}
                  />
          <input type="password"
                 placeholder="Password"
                 value = {password}
                 onChange= {(e)=> setPassword(e.target.value)}
                 />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
          </div>
        </form>
      </div>
    </div>
    )
}
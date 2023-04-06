import axios from "axios";
import { createContext, useEffect, useState } from "react";

type UserContextType = {
    user: any;
    setUser: (user: any) => void;
    ready: boolean
  };
  export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: (user) => console.warn("no setUser function provided"),
    ready: false
  });
export function UserContextProvider({children}:any){
    const[ready,setReady] = useState(false)
    const [user,setUser] = useState(null)

    useEffect(()=>{
        if(!user){
          axios.get('/profile').then(({data})=>{
            setUser(data)
            setReady(true)
          })
        }
    },[user])
    return(
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
 
    )
}
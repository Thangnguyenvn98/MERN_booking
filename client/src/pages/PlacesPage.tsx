import { useState } from "react";
import { Link,  useLocation } from "react-router-dom";
import AccountNav from "../AccountNav";


export default function PlacesPage(){
    const location = useLocation();
    const page = location.pathname.split('/')[1]
   

   
    
    return (
       
        <div>
            
            {page!=='new' &&(
                <>
                <AccountNav/>
            <div className="text-center">
                <Link to={'/account/accomodations/new'} className="bg-red-400  text-white rounded-full mt-6 gap-3 py-4 px-6 inline-flex ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

                    Add new place</Link>
            </div>
            </>
            )}
           
        
            
            </div>
    )
}
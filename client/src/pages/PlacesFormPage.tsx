import { useState } from "react";
import ImageUploader from "./ImageUploader";
import axios from "axios";
import Perks from "./Perks";
import AccountNav from "../AccountNav";
import { Navigate, useLocation } from "react-router-dom";

export default function PlacesFormPage(){
    const location = useLocation()
    const [title,setTitle]=useState("")
    const [address,setAddress]=useState("")
    const [photos,setPhotos]=useState<string[]>([])
    const [description,setDescription]=useState("")
    const[perks,setPerks] = useState([])
    const[extraInfo,setExtraInfo] = useState("")
    const[checkIn,setCheckIn]=useState("")
    const[checkOut,setCheckOut]=useState("")
    const[maxGuests,setMaxGuests]= useState(1)
    const[redirect,setRedirect] = useState(false)

    const addNewPlace = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
       await axios.post('/places',{title,address,photos,description,perks,extraInfo,checkIn,checkOut,maxGuests})
       setRedirect(true)
    }

    if (redirect){
        return <Navigate to ={'/account/accomodations'}/>
    }
    return (
        <div>
            <AccountNav/>
                      <form onSubmit={addNewPlace}>
                        <h2 className="text-2xl mt-4">Title</h2>
                        <input type="text" placeholder="title: MyLovely apt" value={title} onChange={(e)=>setTitle(e.target.value)} />
                        <h2 className="text-2xl mt-4">Address</h2>
                        <input type="text" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)}  />
                        <h2 className="text-2xl mt-4">Photos</h2>
                        <ImageUploader photos={photos} setPhotos={setPhotos}/>
                     
                        <h2 className="text-2xl mt-4">Description</h2>
                        <textarea name="" value={description} onChange={(e)=>setDescription(e.target.value)} ></textarea>
                        <h2 className="text-2xl mt-4">Perks</h2>
                        <Perks selected={perks} onChange={setPerks} />
                        <h2 className="text-2xl mt-4">Extra Infos</h2>
                            <textarea value={extraInfo} onChange={(e)=>setExtraInfo(e.target.value)}/>
                            <h2 className="text-2xl mt-4">Check In and Outs Times</h2>

                            <div className="grid sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                <h3 className="text-lg">Check In Time</h3>
                                <input type="text" placeholder="14:00" value={checkIn} onChange={(e)=>setCheckIn(e.target.value)} />
                                </div>
                                <div>
                                <h3 className="text-lg"> Check Out Time</h3>
                                <input type="text" placeholder="14:00" value={checkOut} onChange={(e)=>setCheckOut(e.target.value)} />
                                </div>
                                <div>
                                <h3 className="text-lg">Max Number Of Guests </h3>
                                <input type="number" placeholder="14:00" value={maxGuests} onChange={(e)=>setMaxGuests(parseInt(e.target.value))} />
                                </div>
                              
                            </div>
                            <button className="primary mt-4">Save</button>
                      </form>
            </div>
    )
}
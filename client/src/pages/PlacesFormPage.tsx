import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import axios, { AxiosError } from "axios";
import Perks from "./Perks";
import AccountNav from "../AccountNav";
import { Navigate,  useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function PlacesFormPage(){
    const {id} = useParams()
    const [title,setTitle]=useState("")
    const [address,setAddress]=useState("")
    const [photos,setPhotos]=useState<string[]>([])
    const [description,setDescription]=useState("")
    const[perks,setPerks] = useState([])
    const[extraInfo,setExtraInfo] = useState("")
    const[checkIn,setCheckIn]=useState("")
    const[checkOut,setCheckOut]=useState("")
    const[maxGuests,setMaxGuests]= useState(1)
    const[price,setPrice] = useState(100)
    const[redirect,setRedirect] = useState(false)

    useEffect(()=>{
        if(!id) {return }

        axios.get(`/places/${id}`).then(response=>{
            const {data} = response //data could be name anything else
            setTitle(data.title)
            setAddress(data.address)
            setPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)
        })
    },[id])


    const addNewPlace = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            const placeData = {title,address,photos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}
            if(id){
               await axios.put('/places', {id, ...placeData})
                //useSpreadOperator if order in the schema is different
                toast.success("Edit your place details successfully")
               setRedirect(true)
     
            }
            else{
            await axios.post('/places',placeData)
            toast.success("Place created successfully")
            setRedirect(true)
        }
        }catch(error){
            if(error instanceof AxiosError){
                toast.error(error.response?.data?.message || "Failed to create/edit your place")} 

            }
        }

       
    

    if (redirect){
        return <Navigate to ={'/account/accomodations'}/>
    }
    
    return (
        <div>
            <AccountNav/>
                      <form onSubmit={addNewPlace}>
                        <h2 className="text-2xl mt-4">Title</h2>
                        <input type="text" placeholder="title: My lovely apt ..." value={title} onChange={(e)=>setTitle(e.target.value)} />
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

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
                                <div>
                                <h3 className="text-lg">Price per night </h3>
                                <input type="number" placeholder="14:00" value={price} onChange={(e)=>setPrice(parseInt(e.target.value))} />
                                </div>
                              
                            </div>
                            <button className="primary mt-4">Save</button>
                      </form>
            </div>
    )
}
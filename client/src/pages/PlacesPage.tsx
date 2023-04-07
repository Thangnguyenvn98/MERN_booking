import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "./Perks";
import axios from "axios";

export default function PlacesPage(){
    const {action} = useParams()
    const [title,setTitle]=useState("")
    const [address,setAddress]=useState("")
    const [photos,setPhotos]=useState<string[]>([])
    const [photoLinks,setPhotoLinks]=useState("")
    const [description,setDescription]=useState("")
    const[perks,setPerks] = useState([])
    const[extraInfo,setExtraInfo] = useState<string[]>([])
    const[checkIn,setCheckIn]=useState("")
    const[checkOut,setCheckOut]=useState("")
    const[maxGuests,setMaxGuests]= useState(1)

    const addPhotoByLink = async (e:any) => {
        e.preventDefault()
        const {data:filename} = await axios.post('/upload-by-link',{link:photoLinks})
        console.log(filename)
        setPhotos(prev => {
            return [...prev,filename]
        })

        setPhotoLinks("")

    }

    const uploadPhoto = (e:any) => {
        const files = e.target.files
        const data = new FormData()
        for(let i=0;i<files.length;i++) {
            data.append('photos',files[0])
        }
        
        axios.post('upload', data ,{
            headers: {'Content-type':'multipart/form-data'},
        }).then(response => {
            const {data:files} = response
            setPhotos(prev => {
                return [...prev, ...files]
            }
            )
        })
    }

    
    return (
        <div>
            {action!=='new' &&(
            <div className="text-center">
                <Link to={'/account/accomodations/new'} className="bg-red-400  text-white rounded-full mt-6 gap-3 py-4 px-6 inline-flex ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

                    Add new place</Link>
            </div>)}
            {action === "new" &&(
            <div>
                      <form>
                        <h2 className="text-2xl mt-4">Title</h2>
                        <input type="text" placeholder="title: MyLovely apt" value={title} onChange={(e)=>setTitle(e.target.value)} />
                        <h2 className="text-2xl mt-4">Address</h2>
                        <input type="text" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)}  />
                        <h2 className="text-2xl mt-4">Photos</h2>
                        <div className="flex gap-4">
                            <input type="text" placeholder="Add using a link ...jpg" value={photoLinks} onChange={(e)=>setPhotoLinks(e.target.value)}  />
                            <button className="p-2 rounded-2xl" onClick={addPhotoByLink}>Add Photo</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:grid-cols-4 sm:grid-cols-6 mt-2">
                            {photos.length >0 && photos.map(photo =>(
                                <div className="flex h-32">
                                    <img className="rounded-2xl w-full object-cover" src={`http://localhost:4000/uploads/${photo}`} alt="Uploaded albums" />
                                </div>
                            ))}
                            <label className="border bg-transparent rounded-2xl p-8 text-2xl font-bold text-gray-600 flex justify-center items-center cursor-pointer h-32 gap-2">
                                <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
</svg>
        
Upload

                            </label>
                        </div>
                        <h2 className="text-2xl mt-4">Description</h2>
                        <textarea name="" value={description} onChange={(e)=>setDescription(e.target.value)} ></textarea>
                        <h2 className="text-2xl mt-4">Perks</h2>
                        <Perks selected={perks} onChange={setPerks} />
                        <h2 className="text-2xl mt-4">Extra Infos</h2>
                            <textarea value={extraInfo} onChange={(e)=>setExtraInfo(prevArray => [...prevArray, e.target.value])}/>
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
      
            
            )}
        
            
            </div>
    )
}
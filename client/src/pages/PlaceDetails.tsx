import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface Place {
    _id: string,
    owner: string;
    title: string;
    address: string;
    photos: string[];
    description: string;
    perks: string;
    extraInfo: string;
    checkIn: number;
    checkOut: number;
    maxGuests: number;
    price: number
  }

export default function PlaceDetails(){
    const [place,setPlace] = useState<Place>()
    const {id} = useParams()
    useEffect(()=>{

        if(!id){
            return
        }
        axios.get(`/places/${id}`).then(response => {
           
            setPlace(response.data)
         
        })

    },[id])
    if(!place) return (<div>No Place Found</div>);

    return(
        <div>
               
               {place.title}
                  
            </div>
    )
}
import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";


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

export default function IndexPage(){
    const [places,setPlaces] = useState<Place[]>([])
    useEffect(()=>{
        axios.get('/allPlaces').then(response=>{
            setPlaces(response.data)
        })
    },[])


    return (
        <div className ="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 mt-4">
            {places.length > 0 && places.map(place =>(
                <Link to={`/accomodations/${place._id}`} key={place._id} >
                    <div className="flex mb-2 rounded-2xl" >
                    {place.photos?.[0]&&(
                        <img src={`http://localhost:4000/uploads/${place.photos?.[0]}`} alt="asd" className="object-cover aspect-square rounded-2xl " />
                    )}
                    </div>
                 
                    <h3 className="font-bold">{place.address}</h3>
                    <h2 className="text-md  text-gray-500">{place.title}</h2>

                    <div className="mt-2">
                        <span className="font-bold">${place.price} </span>
                         per nights</div>
                </Link>
            ))}

        </div>
    )
}
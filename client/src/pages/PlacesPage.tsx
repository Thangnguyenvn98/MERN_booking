import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";

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
    price:number
  }

  

export default function PlacesPage(){
    const [places,setPlaces ] =  useState<Place[]>([])
   
    useEffect(()=>{
        axios.get('/places').then(({data})=>{
            setPlaces(data)
        })
    },[])
   
    
    return (
       
        <div>
        <AccountNav />
          <div className="text-center">
            <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full mt-4" to={'/account/accomodations/new'}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Add new place
            </Link>
          </div>
          <div className="mt-4">
            {places.length > 0 && places.map(place => (
              <Link to={'/account/accomodations/'+place._id} key={place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                <div className="flex h-32 w-32 bg-gray-300 object-cover overflow-hidden " >
                  <PlaceImg place={place} key={place._id}/>
                </div>
                <div className="grow-0 shrink-0">
                  <h2 className="text-xl">{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </Link>
            ))}
          </div>
      </div>
            
           
    )
}
import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import {format} from "date-fns";

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

interface Booking {
    place: Place,
    checkIn:number,
    checkOut:number,
    name:string,
    numberOfGuests:number,
    phoneNumber: number,
    price: number
}

export default function BookingsPage(){
    const [bookings,setBookings] = useState<Booking[]>([])
    useEffect(()=>{
        axios.get('/bookings').then(response => {
            setBookings(response.data)

        })
    },[])
    return (
        <div>
            
            <AccountNav/>
        <div className="mt-4">
        {bookings?.length>0 && bookings?.map(booking =>(
            <div className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
                <div className="w-48">
                   <PlaceImg place={booking.place}/> 
                </div>
                
                <div className="py-3 flex">
                <h2 className="text-xl">{booking.place.title}</h2>

                {format(new Date(booking.checkIn),'yyyy-MM-dd')} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
</svg>
{format(new Date(booking.checkOut),'yyyy-MM-dd')}
                </div>
              
                </div>
        ))}
        </div>            
        </div>
    )
}
import axios from "axios";
import {  differenceInCalendarDays } from "date-fns";
import { useState } from "react";
import { Navigate } from "react-router-dom";

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

export default function BookingPage({place}:{place:Place}){
    const[checkIn,setCheckIn] = useState("")
    const[checkOut,setCheckOut] = useState("")
    const[numberOfGuests,setNumberOfGuests] = useState(1)
    const[name,setName] = useState("")
    const[phoneNumber,setPhoneNumber] = useState(0)
    const[redirect,setRedirect] = useState("")

    let numberOfDays = 0
    if(checkIn && checkOut){
        numberOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }

    const makeBooking = async () => {
        const response = await axios.post('/bookings',{checkIn,checkOut,numberOfGuests,name,phoneNumber,place:place._id,price:numberOfDays * place.price})

        const bookingId = response.data._id
        console.log(bookingId)
        setRedirect(`/account/bookings/${bookingId}`)
        
    }

    if(redirect){
        return <Navigate to = {redirect}/>
    }


    return (
        <div className="bg-white rounded-2xl p-4 shadow">
                          
        <div className="text-2xl text-center">
        Price: ${place.price} / per night
        </div>
        <div className="border rounded-2xl mt-4">
        <div className="flex">   
            <div className="p-4">
            <label >Check In: </label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div className="p-4 border-l">
            <label >Check Out: </label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}/>
        </div>
        </div>
        <div className="p-4 border-t">
        <label >Number of guests: </label>
            <input type="number" value={numberOfGuests} onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}/> 
        </div>
        {numberOfDays > 0 && (
            <div className="p-4 border-t">
            <label >Your Name: </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                <label >Phone Number: </label>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(parseInt(e.target.value))}/>
                </div> 
        )}
    </div>
    
        
        <button className="primary" onClick={makeBooking}>Book This place
        {numberOfDays > 0 && (
            <span> ${numberOfDays * place.price}</span>
        )}
        
        </button>
    </div>
    )

}
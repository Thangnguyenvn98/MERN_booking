import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios";
import BookingDates from "../BookingDates";
import Image from "../Image";

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
    _id:string,
    place: Place,
    checkIn:number,
    checkOut:number,
    name:string,
    numberOfGuests:number,
    phoneNumber: number,
    price: number
}

export default function BookingDetail(){
    const {id} = useParams()
    const[booking,setBooking] = useState<Booking | null>(null)
    const[showPhoto,setShowPhoto] = useState(false)

    useEffect(()=>{
        if(id){
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({_id} :any)=> _id === id )
                if (foundBooking) {
                    setBooking(foundBooking)
                }
            })
        }
    },[id])

    if (!booking) {
        return(
            <div className="text-red-400 text-2xl font-bold">No Booking Found !</div>
        )
    }

    if(showPhoto){
        return(
            <div className="inset-0 min-h-screen absolute bg-black text-white">
                <div className="p-8 grid gap-4 bg-black">
                    <div>
                        <h2 className="text-3xl">Photos of {booking.place.title}</h2>
                        <button onClick={()=>setShowPhoto(false)} className="flex gap-4 rounded-xl right-12 top-8 p-2 fixed shadow-black bg-white text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

                            Close Photos
                        </button>
                    </div>
                {booking.place?.photos?.length>0 && booking.place.photos.map(photo => (
                    
                        <div key={booking.place._id}>
                            <Image src={photo} alt="photolist" />
                        </div>
                    ))}
                </div>
                
            </div>
        )
    }


    return (
        <div className="my-8">
            <div className="flex justify-between">
                <div>
                <h1 className="text-3xl">{booking.place.title}</h1>
                <a className="font-semibold underline my-2 flex gap-2"href={`https://maps.google.com?q=${booking.place.address}`} target='_blank' rel="noreferrer" >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
</svg>

                {booking.place.address}
                </a>
                </div>
            <Link to="/account/bookings" >
                <button className="bg-primary text-white rounded-xl p-6">Back to my bookings</button>
            </Link>
            </div>
          
       
            <div className="bg-gray-200 p-6 my-6 rounded-2xl flex justify-between items-center">
                <div>
                <h2 className="text-2xl mb-2">Your booking information: </h2>
            <BookingDates booking={booking}  />
                </div>
            
            <div className="bg-primary p-6 text-white rounded-2xl">
                <div>
                    Total Price
                </div>
                <div className="text-3xl">$ {booking.price}</div>
            </div>

            </div>
            <div className="relative">
               <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
                <div>
                    {booking.place.photos?.[0] &&(
                        <Image src={booking.place.photos[0]} alt="photo1" onClick={()=>setShowPhoto(true)} className="aspect-square object-cover cursor-pointer"/>
                    )}
                </div>
                <div className="grid ">
                    {booking.place.photos?.[1] &&(
                        <Image src={booking.place.photos[1]} alt="photo2" onClick={()=>setShowPhoto(true)} className="aspect-square object-cover cursor-pointer"/>
                    )}
                    <div className="overflow-hidden ">
                    {booking.place.photos?.[2] &&(
                        <Image src={booking.place.photos[2]} alt="photo3"  onClick={()=>setShowPhoto(true)} className="aspect-square object-cover relative top-4 cursor-pointer"/>
                    )}
                    </div>
                    </div>
                    </div>
                 <button onClick={()=> setShowPhoto(true)} className="absolute bottom-2 right-2 p-2 bg-white rounded-2xl shadow-md shadow-gray-500 flex gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
</svg>



                    Show more photos
                    </button>
                </div>
        </div>
    )
}
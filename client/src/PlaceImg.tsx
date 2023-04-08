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


export default function PlaceImg({place}:{place:Place}, {className=""}) {
    if (!place.photos?.length) {
      return <div>Nothing to show here</div>
    }

    if(!className){
        className = "object-cover"
    }

    return (
      <div>
        {place.photos.length > 0 && (
          <img
            src={"http://localhost:4000/uploads/"+place.photos[0]}
            alt="asd"
            className={className}
          />
        )}
      </div>
    )
  }
import axios from "axios"
import { useState } from "react"

type ImageUploaderProps = {
    photos: string[] | string;
    setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  }

export default function ImageUploader({photos,setPhotos}:  ImageUploaderProps){
    const [photoLinks,setPhotoLinks]=useState("")


    const addPhotoByLink = async (e: any) => {
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
        <>
           <div className="flex gap-4">
                            <input type="text" placeholder="Add using a link ...jpg" value={photoLinks} onChange={(e)=>setPhotoLinks(e.target.value)}  />
                            <button className="p-2 rounded-2xl" onClick={addPhotoByLink}>Add Photo</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:grid-cols-4 sm:grid-cols-6 mt-2">
                            {Array.isArray(photos)&&photos.length >0 && photos.map(photo =>(
                                <div className="flex h-32" key={photo}>
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
            </>
     
    )
}
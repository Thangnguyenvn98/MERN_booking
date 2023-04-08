const express = require('express')
const cors = require('cors')
const app = express()
const bcrypt = require('bcryptjs') //Hiding passwwords
const jwt = require('jsonwebtoken') //Sending cookie
const mongoose = require('mongoose')
const multer  = require('multer') //upload image from PC

const User = require('./models/User')
const Place = require('./models/Place')
const Booking = require('./models/Booking')
const cookieParser = require('cookie-parser') //Saving cookie and parse it
const imageDownloader = require('image-downloader')
require('dotenv').config()


const bcryptSalt = bcrypt.genSaltSync(10) //documentation consut
const jwtSecret = 'dfgdfgsegresgsaeqwerew' //anything here

const photosMiddleware= multer({ dest: 'uploads' }) //from documentations
const fs= require('fs')


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000'
}))
app.use('/uploads',express.static(__dirname + '/uploads'))

mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

app.get('/test',(req,res)=>{
    res.json('test pl')

})

app.post('/register',async (req,res)=>{
    const{name,email,password} = req.body
    try{
        const userReg = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(userReg)
    }catch (e){
        res.status(422).json(e)
    }
  

})

app.post('/login', async(req,res) => {
    const {email, password} = req.body
    const userReg = await User.findOne({ email})
    if (userReg){
        const passOk = bcrypt.compareSync(password, userReg.password)
        if(passOk){
            jwt.sign({email:userReg,email, id:userReg._id,name:userReg.email},jwtSecret,{},(err,token)=>{
                if(err) throw err
                res.cookie('token',token).json(userReg)
            })}else{
                res.status(422).json("pass not ok")
            }
        
        }else{
            res.json("Not FOund")
        }
    
})

app.get('/profile',(req,res)=>{
    const {token} = req.cookies
    if (token){
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if(err) throw err
            const {name,_id,email} = await User.findById(user.id)
            res.json({name,_id,email})
        })
    }else {
        res.json(null)
    }
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true)
})

app.post('/upload-by-link',async (req,res)=>{
    const{link} = req.body
    const newName = 'photo'+Date.now()+'.jpg'
   try{await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/'+newName
    })
    res.json(newName)}catch(err){
        res.status(500).json({ error: 'Failed to download image' })
    }
})
                                    //photos here is the key name from front-end when setting data from FormData
app.post('/upload',photosMiddleware.array('photos',100),(req, res) => {
    photosUploaded = []
    for(let i = 0; i <req.files.length;i++){
        const {path, originalname} = req.files[i];
        const originalFileName = originalname.split('.')
        const extension = originalFileName[originalFileName.length - 1]
        const newPath = `${path}.${extension}`
        fs.renameSync(path,newPath)
        photosUploaded.push(newPath.replace('uploads/',''))
    }
    res.json(photosUploaded)
})

app.post('/places',(req, res) => {
    const {token} = req.cookies
    const {title,address,photos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if(err) throw err
        const placeCreated = await Place.create({
            owner:user.id, //userId here is the ID from UserSchema created not the place ID itself
            title: title,
            address:address,
            photos:photos,
            description:description,
            perks:perks,
            extraInfo:extraInfo,
            checkIn:checkIn,
            checkOut:checkOut,
            maxGuests:maxGuests,
            price:price

        })
        res.json(placeCreated)
    })
})

app.get('/places',async (req,res)=>{
    const {token} = req.cookies
    jwt.verify(token, jwtSecret, {}, async (err,user)=>{
        const {id} = user
        res.json(await Place.find({owner:id}))
    })
})

app.get('/places/:id',async (req,res)=>{
    const {id} = req.params
    res.json(await Place.findById(id))
})

app.put('/places',async (req,res)=>{
    const {token} = req.cookies

    const {id,title,address,photos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body
    jwt.verify(token, jwtSecret, {}, async (err,user)=>{
        if(err) throw err
        const placeDocument = await Place.findById(id)

        if(user.id === placeDocument.owner.toString()){
            placeDocument.set({title,address,photos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price})
        
        await placeDocument.save()
        res.json('ok')
    }
    })
})

app.get('/allPlaces',async (req,res)=>{
    res.json(await Place.find())
})

app.post('/bookings',async (req,res)=>{
    const userData = await getUserDataFromReq(req)
    const{place,checkIn,checkOut,numberOfGuests,name,phoneNumber,price} = req.body
    try{
        const data = await Booking.create({place,user:userData.id,checkIn,checkOut,numberOfGuests,name,phoneNumber,price})
        res.json(data)
    }catch(err){
        res.status(500).json( err )

    }
  
})

const getUserDataFromReq = (req) => {
    return new Promise((resolve,reject) => {
        jwt.verify(req.cookies.token,jwtSecret,{},async(err,user) => {
            if(err)throw err
            resolve(user)
        })
    })
}

app.get('/bookings',async (req,res)=>{
    const userData = await getUserDataFromReq(req)
    res.json(await Booking.find({user:userData.id}).populate('place'))  //place here is the key on Place model
})

app.listen(4000,() => {
    console.log('listening on port 4000')
})
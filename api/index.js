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

const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const bcryptSalt = bcrypt.genSaltSync(10) //documentation consut
const jwtSecret = 'dfgdfgsegresgsaeqwerew' //anything here
const bucket = 'thang-booking-app'
const mime = require('mime-types')
const fs= require('fs')


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000'
}))
app.use('/api/uploads',express.static(__dirname + '/uploads'))

const photosMiddleware = multer({dest:'/tmp'})


const uploadToS3 = async (path,originalFileName,mimemtype) => {
    const client = new S3Client({
        region: 'us-east-2',
        credentials:{
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        },
    })
    const parts = originalFileName.split('.')
    const ext = parts[parts.length - 1]
    const newFileName = Date.now()+'.'+ext
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFileName,
        ContentType: mimemtype,
        ACL: 'public-read'
    }))

    return `https://${bucket}.s3.amazonaws.com/${newFileName}`
}

app.get('/api/test',(req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

    res.json('test pl')

})

app.post('/api/register',async (req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

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

app.post('/api/login', async(req,res) => {
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

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

app.get('/api/profile',(req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

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

app.post('/api/logout',(req,res)=>{
    res.cookie('token','').json(true)
})

app.post('/api/upload-by-link',async (req,res)=>{

    const{link} = req.body
    const newName = 'photo'+Date.now()+'.jpg'
   try{await imageDownloader.image({
        url: link,
        dest: '/tmp/'+newName
    })
    const url = await uploadToS3('/tmp/'+newName,newName,mime.lookup('/tmp/'+newName))
    res.json(url)}catch(err){
        res.status(500).json({ error: 'Failed to download image' })
    }
})
                                    //photos here is the key name from front-end when setting data from FormData
app.post('/api/upload',photosMiddleware.array('photos',100), async (req, res) => {
    photosUploaded = []
    for(let i = 0; i <req.files.length;i++){
        const {path, originalname,mimetype} = req.files[i];
        const url = await uploadToS3(path,originalname,mimetype)
        photosUploaded.push(url)
    }
    res.json(photosUploaded)
})

app.post('/api/places',(req, res) => {
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

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

app.get('/api/places',async (req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

    const {token} = req.cookies
    jwt.verify(token, jwtSecret, {}, async (err,user)=>{
        const {id} = user
        res.json(await Place.find({owner:id}))
    })
})

app.get('/api/places/:id',async (req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

    const {id} = req.params
    res.json(await Place.findById(id))
})

app.put('/api/places',async (req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

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

app.get('/api/allPlaces',async (req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

    res.json(await Place.find())
})

app.post('/api/bookings',async (req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

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

app.get('/api/bookings',async (req,res)=>{
    mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

    const userData = await getUserDataFromReq(req)
    res.json(await Booking.find({user:userData.id}).populate('place'))  //place here is the key on Place model
})

if(process.env.API_PORT){
    app.listen(process.env.API_PORT,() => {
        console.log('listening on port 4000')
    })
}

module.exports = app
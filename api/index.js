const express = require('express')
const cors = require('cors')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('./models/User')
const cookieParser = require('cookie-parser')
require('dotenv').config()


const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = 'dfgdfgsegresgsaeqwerew' //anything here

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000'
}))

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


app.listen(4000,() => {
    console.log('listening on port 4000')
})
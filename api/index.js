const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

app.use(express.json())

app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000'
}))

mongoose.connect(process.env.MONGOOSE_DATABASE_URL)

app.get('/test',(req,res)=>{
    res.json('test pl')

})

app.post('/register',(req,res)=>{
    const{name,email,password} = req.body
    res.json({name,email,password})

})

app.listen(4000,() => {
    console.log('listening on port 4000')
})
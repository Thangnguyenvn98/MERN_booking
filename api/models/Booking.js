const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'}, //reference the Place Object created in Place
    user: {type:mongoose.Schema.Types.ObjectId, required:true},
    checkIn:{type: Date, required:true},
    checkOut:{type: Date, required:true},
    name:{type:String, required:true},
    numberOfGuests:{type:Number, required:true},
    phoneNumber: {type:Number, required:true},
    price: Number

})

const BookingModel = mongoose.model('Booking',bookingSchema)

module.exports = BookingModel
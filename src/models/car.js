const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
        name : {
            type : String, 
            trim: true,
            required : {true: 'Enter your name'}
        },
        image : {
            type : String,             
            required : {true: 'Enter your image'}
        }, 
        capacity : {
            type : Number, 
            required : {true: 'Enter your caacity'}
        },
        fuelType : {
            type : String, 
            required : {true: 'Enter your Fuel Type'}
        }, 
        bookedTimeSlots : [
            {
                from : {type : String, required : true},
                to : {type : String, required : true}
            }
        ] , 

        rentPerHour : {type : Number, required : true}
    }, 
    {timestamps : true, versionKey: false}
)
const Car = mongoose.model('Car' , carSchema)
module.exports = Car
const mongoose = require('mongoose');
const Joi = require('joi');

const filmSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength:5,
        maxlength: 50,
        required: true
    },
    dailyRentalRate:{
        type: Number,
        min:0,
        max:300,
        required: true
    }
})

const customerSchema = new mongoose.Schema({
    isGold: {type: Boolean, default: false},
    name:{ type: String,
        minlength: 5,
        maxlength:50, 
        required: true},
    phone:{ type: String,
        minlength:5,
        maxlength:50,
        required:true}
})

const rentalSchema = new mongoose.Schema({
    customer:{
        type: customerSchema,
        required: true
    },
    film:{
        type: filmSchema,
        required:true
    },
    dateOut:{
        type: Date,
        required:true,
        default:Date.now
    },
    dateReturned:{
        type: Date
    },
    rentalFee:{
        type:Number,
        min:0
    }
})

rentalSchema.statics.lookup = function (customerId, filmId){
    return this.findOne({'customer._id':customerId, 'film._id':filmId})
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        userId: Joi.objectId().required(),
        filmId: Joi.objectId().required()
    })
    return Joi.validate(rental, schema);
}

module.exports = {
    Rental, validateRental
}
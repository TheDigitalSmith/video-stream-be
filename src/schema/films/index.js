const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('../genre');

const filmSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength:5,
        maxlength: 50,
        required: true
    },
    genre:{
        type:genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        min:0,
        max:300,
        required: true
    },
    dailyRentalRate:{
        type: Number,
        min:0,
        max:300,
        required: true
    }
})

const Film = mongoose.model('Film', filmSchema);

function validateFilms(film){
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(300).required(),
        dailyRentalRate: Joi.number().min(0).max(300).required()
    })
    return Joi.validate(film, schema)
}

module.exports = {Film, filmSchema, validate: validateFilms};
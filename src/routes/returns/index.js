//POST /api/returns {customerId, filmId}

//Return 401 if client is not logged in
//Return 400 if customerId is not provided
//Return 400 if filmId is not provided
//Return 404 if no rental found with the customer/film
//Return 400 if rental already processed
//Return 200 if valid request
//Set the return date
//Calculate the rental fee (numberOfDays * movie.dailyRentalRate)
//Increase the stock
//Return the rental

const Joi = require('joi');
const moment = require('moment');
const express = require('express');
const router = express.Router();
const {Rental} = require('../../schema/rental');
const {Film} = require('../../schema/films');
const auth = require('../../utils/middleware/auth');
const validate = require('../../utils/middleware/validate');

router.post('/', [auth, validate(validateReturn)] , async(req,res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.filmId)
    if (!rental) return res.status(404).send('Rental not found');
    if(rental.dateReturned) return res.status(400).send('Rental already in process');
    rental.return()
    // rental.dateReturned = new Date();
    // const rentalDays = moment().diff(rental.dateOut, 'days')
    // rental.rentalFee = rentalDays * rental.film.dailyRentalRate
    await rental.save();
    await Film.update({_id: rental.film._id},{
        $inc:{
            numberInStock: 1
        }
    })
    // const film = await Film.findById(req.body.filmId);
    // film.numberInStock += 1
    // await film.save();

    return res.status(200).send(rental);
})

function validateReturn(req){
    const schema = {
        customerId: Joi.objectId().required(),
        filmId: Joi.objectId().required()
    }

    return Joi.validate(req, schema);
}

module.exports = router;
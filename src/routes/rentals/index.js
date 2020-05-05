const express = require("express");
const { Rental, validateRental } = require("../../schema/rental");
const { Film } = require("../../schema/films");
const { Customer } = require("../../schema/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const validate = require('../../utils/middleware/validate');

const router = express.Router();
Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find({}).sort({ dateOut: -1 });
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.find({});
  if (!rental) return res.status(400).send("Invalid rental ID");
  res.send(rental);
});

router.post("/",validate(validateRental) , async (req, res) => {
  const customer = await Customer.findById(req.body.userId);
  if (!customer) return res.status(400).send("Invalid user ID");

  const film = await Film.findById(req.body.filmId);
  if (!film) return res.status(400).send("Invalid film ID");

  if (film.numberInStock === 0)
    return res.status(400).send("Movie is not in stock");

  const rental = new Rental({
    user: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    film: {
      _id: film._id,
      title: film.title,
      dailyRental: film.dailyRentalRate,
    },
  });
  // const newRental = await rental.save();
  // film.numberInStock--;
  // film.save();
  try {
    new Fawn.Task()
      .save("Rentals", rental)
      .update(
        "Films",
        { _id: film._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (err) {
    res.status(500).send(err);
  }

  // res.send(newRental);
});

module.exports = router;

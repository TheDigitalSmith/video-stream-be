const express = require("express");
const auth = require("../../utils/middleware/auth");
const validate = require('../../utils/middleware/validate');
const validateObjectId = require('../../utils/middleware/validateObjectId');
const admin = require('../../utils/middleware/admin');
const { Film, validate: validateFilm } = require("../../schema/films");
const { Genre } = require("../../schema/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  const films = await Film.find({}).sort({ name: 1 });
  res.send(films);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const films = await Film.findById(req.params.id);
  if (!films) return res.status(404).send("Film not found");
  res.send(films);
});

router.post("/",[ auth, validate(validateFilm)], async (req, res) => {
  const genre = Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  try {
    const film = new Film({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    await film.save();
    res.send(film);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/:id", [auth, validateObjectId, validate(validateFilm)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre ID");

  try {
    const updateFilm = await Film.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          genre: {
            _id: genre._id,
            name: genre.name,
          },
        },
      },
      { new: true }
    );

    if (!updateFilm) return res.status(404).send("Failed to update film, invalid ID");
    
    res.send(updateFilm);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const remove = await Film.findByIdAndRemove(req.params.id);
  if (!remove) return res.status(404).json("Failed to remove film");
  res.send({ status: "Successfully Removed", film: remove });
});

module.exports = router;

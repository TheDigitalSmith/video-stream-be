const express = require("express");
const { Film, validate } = require("../../schema/films");
const {Genre} = require("../../schema/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  const films = await Film.find({}).sort({name: 1});
  res.send(films);
});

router.get("/:id", async (req, res) => {
  const films = await Film.findById(req.params.id);
  if (!films) return res.status(404).send("Film not found");
  res.send(films);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);
  
  const genre = Genre.findById(req.body.genreId);
  if(!genre) return res.status(400).send('Invalid genre');

  try {
    const film = new Film({
        title: req.body.title,
        genre:{
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
     });
    const newFilm = await film.save();
    res.send(newFilm);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre ID');

  try {
    const updateFilm = await Film.findByIdAndUpdate(req.params.id, {
      $set: { 
          title: req.body.title,
          genre:{
              _id: genre._id,
              name: genre.name
          }
      },
    }, {new:true});

    if (!updateFilm) return res.status(404).send("Failed to update film, invalid ID");
    res.send(updateFilm);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
    const remove = await Film.findByIdAndRemove(req.params.id);
    if(!remove) return res.status(404).json('Failed to remove film');
    res.send({status:'Successfully Removed', film: remove})
});

module.exports = router;

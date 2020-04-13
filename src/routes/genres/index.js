const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Genre = require("../../schema/genre");

// const genres = [
//     {id: 1, genre:"thriller"},
//     {id: 2, genre:"action"},
//     {id: 3, genre:"comedy"},
//     {id: 4, genre:"horror"}
// ]

router.get("/", async (req, res) => {
  const genres = await Genre.find({}).sort({name: 1});
  
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const filmsGenre = await Genre.findById(req.params.id);
  if (!filmsGenre) return res.status(404).send("Genre not found");

  res.send(filmsGenre);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre = new Genre({
    ...req.body,
  });
  try {
    const result = await newGenre.save();
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genreEdit = await Genre.findByIdAndUpdate(req.params.id, {
    $set: {
      ...req.body,
    },
  }, {new: true});
  if (!genreEdit) return res.status(404).send("Genre not found");

  res.send(genreEdit);
});

router.delete("/:id", async (req, res) => {
  const genreDelete = await Genre.findByIdAndRemove(req.params.id);
  if (!genreDelete) return res.status(404).send("Genre not found");
  res.send(genreDelete);
});

function validateGenre(genre) {
  const schema = Joi.object ({
    genre: Joi.string().min(3).required(),
  });
  return Joi.validate(genre, schema);
}

module.exports = router;
// const asyncMiddleware = require("../../utils/middleware/async");
const auth = require("../../utils/middleware/auth");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Genre, validate: validateGenre } = require("../../schema/genre");
const admin = require("../../utils/middleware/admin");
const validateObjectId = require('../../utils/middleware/validateObjectId');
const validate = require('../../utils/middleware/validate');
// const genres = [
//     {id: 1, genre:"thriller"},
//     {id: 2, genre:"action"},
//     {id: 3, genre:"comedy"},
//     {id: 4, genre:"horror"}
// ]

router.get("/", async (req, res, next) => {
  const genres = await Genre.find({}).sort({ name: 1 });
  res.send(genres);
});

router.get("/:id", validateObjectId ,async (req, res) => {
  const filmsGenre = await Genre.findById(req.params.id);
  if (!filmsGenre) return res.status(404).send("Genre not found");
  res.send(filmsGenre);
});

router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  const newGenre = new Genre({
    ...req.body,
  });
  try {
    await newGenre.save();
    res.send(newGenre);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/:id", [validateObjectId, auth, validate(validateGenre)], async (req, res) => {
  const genreEdit = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...req.body,
      },
    },
    { new: true }
  );
  if (!genreEdit) return res.status(404).send("Genre not found");

  res.send(genreEdit);
});

router.delete("/:id", [ validateObjectId, auth, admin], async (req, res) => {
  const genreDelete = await Genre.findByIdAndRemove(req.params.id);
  if (!genreDelete) return res.status(404).send("Genre not found");
  res.send({ status: "removed successfully", genre: genreDelete });
});

module.exports = router;

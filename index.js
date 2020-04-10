const express = require ('express');
const Joi = require('joi');
const app = express();

const genres = [
    {id: 1, genre:"thriller"},
    {id: 2, genre:"action"},
    {id: 3, genre:"comedy"},
    {id: 4, genre:"horror"}
]

app.get('api/films/genre',(req,res)=>{
    res.send(genres);
})

app.get('/api/films/:genre', (req,res)=>{ 
    const filmsGenre = genres.find(f => f.genre === req.params.genre);
    if (!filmsGenre) return res.status(404).send('Genre not found');
    
    res.send(filmsGenre);
})

app.post('/api/films/genre', (req,res)=>{
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const newGenre = {
        id: genres.length + 1,
        genre: req.body.genre
    }

    genres.push(newGenre)
    res.send(newGenre);
})

app.put('/api/films/:genre', (req,res)=>{
    const genreEdit = genres.find(g  => g.genre === req.params.genre);
    if (!genreEdit) return res.status(404).send('Genre not found');
    
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genreEdit.genre = req.body.genre;
    res.send(genreToEdit);
})

app.delete('/api/films/:genre', (req,res)=>{
    const genreDelete = genres.find(g => g.genre === req.params.genre);
    if (!genreDelete) return res.status(404).send('Genre not found');

    const index = genres.indexOf(genreDelete);
    genres.splice(index,1);
    res.send(genreDelete);
})

function validateGenre(genre){
    const schema = {
        genre: Joi.required()
    }
    return Joi.validate(genre, schema);
}

app.listen(4110, ()=> {
    console.log('listening on port 4110');
})
const express = require ('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

const genres = [
    {id: 1, genre:"thriller"},
    {id: 2, genre:"action"},
    {id: 3, genre:"comedy"},
    {id: 4, genre:"horror"}
]

app.get('api/films/genre',(req,res)=>{
    res.send(genres);
})

app.get('/api/films/:id', (req,res)=>{ 
    const filmsGenre = genres.find(f => f.id === req.params.id);
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

app.put('/api/films/:id', (req,res)=>{
    const genreEdit = genres.find(g  => g.id === req.params.id);
    if (!genreEdit) return res.status(404).send('Genre not found');
    
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genreEdit.genre = req.body.genre;
    res.send(genreToEdit);
})

app.delete('/api/films/:id', (req,res)=>{
    const genreDelete = genres.find(g => g.id === req.params.id);
    if (!genreDelete) return res.status(404).send('Genre not found');

    const index = genres.indexOf(genreDelete);
    genres.splice(index,1);
    res.send(genreDelete);
})

function validateGenre(genre){
    const schema = {
        genre: Joi.min(3).required()
    }
    return Joi.validate(genre, schema);
}

const port = process.env.PORT || 4110
app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})
const debug = require('debug')('app:startup');
const express = require ('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const {auth,log} = require ('./middleware/logger');
const morgan = require('morgan');
const genreService = require('./src/routes/genres');

const app = express();
dotenv.config();

app.use(express.json());
app.use(log);
app.use(auth);
app.use(helmet());
app.use('/api/films/genre', genreService);

if(process.env.NODE_ENV === "development"){
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

const port = process.env.PORT || 4110
app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})
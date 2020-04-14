const debug = require('debug')('app:startup');
const express = require ('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const {auth,log} = require ('./middleware/logger');
const morgan = require('morgan');
const genreService = require('./src/routes/genres');
const customerService = require ('./src/routes/customers');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

app.use(express.json());
app.use(log);
app.use(auth);
app.use(helmet());

if(process.env.NODE_ENV === "development"){
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false})
.then(db => console.log('MongoDb connected'), err=> console.log('Failed to connect to MongoDB', err))

app.use('/api/films/genre', genreService);
app.use('/api/customer', customerService);

const port = process.env.PORT || 4110
app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})
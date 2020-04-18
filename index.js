const express = require ('express');
const dotenv = require('dotenv');
const app = express();
const winston = require('winston');
dotenv.config();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
// require('./startup/config')();
require('./startup/validation')();

require("winston-mongodb");
require('express-async-errors');

const port = process.env.PORT || 4110
app.listen(port, ()=> {
    winston.info(`listening on port ${port}`);
})
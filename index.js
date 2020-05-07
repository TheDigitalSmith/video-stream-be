const express = require ('express');
const dotenv = require('dotenv');
const app = express();
const winston = require('winston');
require("winston-mongodb");
require('express-async-errors');
dotenv.config();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
// require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 4110
const server = app.listen(port, ()=> {
    winston.info(`listening on port ${port}`);
})

module.exports = server;
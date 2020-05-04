const express = require('express');
const returnService = require('../src/routes/returns');
const genreService = require("../src/routes/genres/");
const customerService = require("../src/routes/customers");
const filmService = require("../src/routes/films");
const rentalService = require("../src/routes/rentals");
const registrationService = require("../src/routes/user");
const authenticationService = require("../src/utils/auth");
const errorMiddleware = require("../src/utils/middleware/error");
const {auth,log} = require ('../middleware/logger');
const helmet = require('helmet');

module.exports = function (app) {
  app.use(express.json());
  app.use(log);
  app.use(auth);
  app.use(helmet());
  app.use("/api/films/genre", genreService);
  app.use("/api/customer", customerService);
  app.use("/api/films", filmService);
  app.use("/api/rentals", rentalService);
  app.use("/api/users", registrationService);
  app.use("/api/auth", authenticationService);
  app.use("/api/returns", returnService);
  app.use(errorMiddleware);
};

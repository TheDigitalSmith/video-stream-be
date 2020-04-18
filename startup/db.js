const mongoose = require("mongoose");
const winston = require('winston');

module.exports = function () {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(
      (db) => winston.info("MongoDb connected"),
    );
};

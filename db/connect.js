const mongoose = require("mongoose");

//connect to DB
const connectDB = async(url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;

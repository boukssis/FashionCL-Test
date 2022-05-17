const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found")
const errorHandler = require("./middleware/error-Handler")


const PORT = process.env.PORT || 3000

app.use(express.json());
 



app.use(notFound)
app.use(errorHandler)

//starting DB and server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();


module.exports = app

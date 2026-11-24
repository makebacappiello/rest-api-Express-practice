// importing express
const express = require("express");

//creating an express app
const app = express();

//importing routes
const routes = require("./routes");

//importing the records.js
const records = require("./records");

//middleware that tells express we are expecting requests to come in as json and parses the incoming Json object so that data from the request is available
app.use(express.json());
app.use("/api", routes);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  next(err);
  err.status = 404;
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});
//listening on port 3000
app.listen(3000, () => console.log("Quote API listening on port 3000!"));

// importing express
const express = require("express");

//creating an express app
const app = express();

//importing the records.js
const records = require("./records");

//function to shorten our code
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

//middleware that tells express we are expecting requests to come in as json and parses the incoming Json object st that data from the request is available
app.use(express.json());

//Send a GET request to /quotes to READ a list of quotes
app.get("/quotes", async (req, res) => {
  try {
    const quotes = await records.getQuotes();
    res.json(quotes);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//send a GET request to /quotes/:id to READ(view) a quote
app.get("/quotes/:id", async (req, res) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: "Quote Not Found..." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Send a POST request to /quotes to CREATE a new quote
app.post("/quotes", async (req, res) => {
  try {
    if (req.body.author && req.body.quote) {
      const quote = await records.createQuote({
        quote: req.body.quote,
        author: req.body.author,
      });
      res.status(201).json(quote);
    } else {
      res.status(400).json({ message: "Quote and author required." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Send a PUT request to /quotes/:id toUPDATE (edit) a quote
app.put("/quotes/:id", async (req, res) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;

      await records.updateQuote(quote);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Quote not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Send a DELETE request to /quotes/:id to DELETE a quote
app.delete("/quotes/:id", async (req, res, next) => {
  try {
    throw new Error("Somenthing Horrible Happened!!!!!");
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      await records.deleteQuote(quote);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Quote does not Exist" });
    }
  } catch (err) {
    // res.status(500).json({ message: err.message });
    next(err);
  }
});

//Send a GET request to /quotes/quote/random to  READ (view) a random quote

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

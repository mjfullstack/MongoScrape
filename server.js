// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");

// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.send("Hello world");
  console.log("BE: APP '/' Got Hit!")
});

// Main route (simple Hello World Message)
app.get("/clear", function (req, res) {
  res.send("Hello CLEARED world");
  console.log("BE: APP '/clear' Got Hit!");
  db.scrape.drop(); // WORKS
});

// Main route (simple Hello World Message)
app.get("/all", function (req, res) {
  res.send("Hello ALL world");
  console.log("BE: APP '/all' Got Hit!")
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/scrape", function (req, res) {
  axios.get("https://news.ycombinator.com/").then(function (response) {
    // console.log("response: ", response);
    //    console.log("response.data: ", response.data);
        // NOT Working Yet!
        // fs.writeFile("response.data.3010.json", response.data, function (err) {
        //   if (err) throw err;
        //   console.log('response.data.json Saved!');
        // });
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
    var results = [];
    db.scrape.drop(); // Empty contents previouslyin DB 
    $(".title").each(function (idx, element) {
      var link = $(element).children("a").attr("href");
      if (link) {
        var title = $(element).children("a").text();
        console.log("title: ", title);
        console.log("link: ", link);
        results.push({ link, title });
        db.scrape.insert({title: title, link: link});
      } else {
        console.log("No link found for this title element.")
      }
    });
    db.scrape.find().sort({ title: 1 }, function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log("SERVER:DB find on /scrape error: ", error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
    // An empty array to save the data that we'll scrape
    // res.json({ results });
  })
  .catch(function (err) {
    console.log("Error: Axios /scrape: ", err);
  });  
})

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

app.get("/scraperev", function (req, res) {
  axios.get("https://news.ycombinator.com/").then(function (response) {
    // console.log("response: ", response);
    //    console.log("response.data: ", response.data);
        // NOT Working Yet!
        // fs.writeFile("response.data.3010.json", response.data, function (err) {
        //   if (err) throw err;
        //   console.log('response.data.json Saved!');
        // });
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
    var results = [];
    db.scrape.drop(); // Empty contents previouslyin DB 
    $(".title").each(function (idx, element) {
      var link = $(element).children("a").attr("href");
      if (link) {
        var title = $(element).children("a").text();
        console.log("title: ", title);
        console.log("link: ", link);
        results.push({ link, title });
        db.scrape.insert({title: title, link: link});
      } else {
        console.log("No link found for this title element.")
      }
    });

    // 
    db.scrape.find().sort({ _id: -1 }, function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log("SERVER:DB find on /scraperev error: ", error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
    // An empty array to save the data that we'll scrape
    // res.json({ results });
  })
  .catch(function (err) {
    console.log("Error: Axios /scraperev: ", err);
  });  
})

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3010
app.listen(3010, function () {
  console.log("App running on port 3010!");
});

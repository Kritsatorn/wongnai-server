var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");

const path = "http://localhost:9000/trips";
const axios = require("axios").default;

app.use(bodyParser.json());
app.use(cors());

getJSON = (req, res, next) => {
  axios
    .get(path)
    .then((res) => res.data)
    .then((data) => {
      req.trips = data;
      next();
    })
    .catch((err) =>
      res.status(500).json({ message: "Can't fetch data " + err })
    );
};

queryTrips = (req, res, next) => {
  const keyword = req.query.keyword;
  const keywords = keyword ? keyword.split(" ") : keyword;
  const trips = req.trips;
  if (!keyword) {
    return res.status(200).json({ message: "ALL trips", data: trips });
  }

  searchKeyword = (trip) => {
    let choose = false;
    trip.tags.forEach((tag) =>
      keywords.some((keyword) => tag.includes(keyword)) ? (choose = true) : null
    );

    if (keywords.some((keyword) => trip.title.includes(keyword))) choose = true;
    if (keywords.some((keyword) => trip.description.includes(keyword)))
      choose = true;
    return choose;
  };

  const selectedTrips = trips.filter((trip) => searchKeyword(trip));
  if (selectedTrips) {
    res
      .status(200)
      .json({ message: "Selected trip by keyword.", data: selectedTrips });
  } else {
    res.status(200).json({ message: "Keyword not found", data: {} });
  }
};

var tripStuff = [getJSON, queryTrips];
app.get("/api/trips", tripStuff);

app.listen(3001, () => {
  console.log("Start server at port 3001.");
});

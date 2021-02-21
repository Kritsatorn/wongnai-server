var express = require("express");
var app = express();
var bodyParser = require("body-parser");

const path = "http://localhost:9000/trips";
const axios = require("axios").default;

app.use(bodyParser.json());

getJSON = (req, res, next) => {
  console.log("Request URL:", req.originalUrl);
  axios
    .get(path)
    .then((res) => res.data)
    .then((data) => {
      req.trips = data;
      next();
    })
    .catch((err) => res.status(500).json({ message: err }));
};

queryTrips = (req, res, next) => {
  const keyword = req.query.keyword;
  const trips = req.trips;
  if (!keyword) {
    res
      .status(200)
      .json({ message: "Search is not set, return all", data: trips });
  }
  searchKeyword = (trip) => {
    let choose = false;
    trip.tags.forEach((tag) =>
      tag.includes(keyword) ? (choose = true) : null
    );
    if (trip.title.includes(keyword)) choose = true;
    if (trip.description.includes(keyword)) choose = true;
    return choose;
  };
  const selectedTrips = trips.filter((trip) => searchKeyword(trip));
  if (selectedTrips) {
    res
      .status(200)
      .json({ message: "Search is not set, return all", data: selectedTrips });
  } else {
    res.status(200).json({ message: "Search not found ", data: {} });
  }
};

var tripStuff = [getJSON, queryTrips];
app.get("/api/trips", tripStuff);

app.listen(3001, () => {
  console.log("Start server at port 3001.");
});
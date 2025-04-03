const express = require("express");
const app = express();
const path = require("path");
const Movie = require("./db/Movie");
const Casts = require("./db/Casts");
const degreesOfSeparation = require("./api/degreesOfSeparation");

app.use(express.json());
app.engine("html", require("ejs").renderFile);

app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use("/static", express.static(path.join(__dirname, "../static")));

app.get("/", (req, res) =>
  res.render(path.join(__dirname, "../static/index.html"), {
    CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  })
);

app.use("/api/auth", require("./api/auth"));
app.use("/api/degreesOfSeparation", degreesOfSeparation);
app.use("/api/movies", require("./api/movies"));
app.use("/api/actors", require("./api/actors"));
app.use("/api/users", require("./api/user"));
app.use("/api/favorites", require("./api/favorites"));

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err, message: err.message });
});

module.exports = app;
const express = require("express");
var bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const db = require("./db.json");
const fs = require("fs");

const app = express();

app.engine(".hbs", hbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {

  let { username, links } = db
  res.render("home", { username, links });
});

// save our username
app.post("/name", function(req, res, next) {
  db.username = req.body.username;

  console.log(db, JSON.stringify(db));

  saveDB(db, err => {
    if (err) next(err);
    res.redirect("/");
  });
});

app.post("/link", function(req, res, next) {
  let { link, label } = req.body;

  if (!db.links) db.links = [];

  db.links.push({ link, label, timestamp: +(new Date()) });

  saveDB(db, err => {
    if (err) next(err);
    res.redirect("/");
  });
});

app.listen(process.env.PORT || 3000);


function saveDB(db, cb) {
  fs.writeFile("db.json", JSON.stringify(db), err => {
    cb(err);
  });
}


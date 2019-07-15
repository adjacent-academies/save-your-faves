const express = require("express");
var bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const moment = require("moment");
const session = require("express-session");

const app = express();

var hbs = exphbs.create({
  helpers: {
    formatDate: date => moment(date).fromNow()
  },
  extname: ".hbs"
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  let { username, links } = req.session;
  res.render("home", { username, links });
});

// save our username
app.post("/name", function(req, res, next) {
  req.session.username = req.body.username;
  res.redirect("/");
});

app.post("/link", function(req, res, next) {
  let { link, label } = req.body;
  if (!req.session.links) req.session.links = [];
  req.session.links.push({ link, label, timestamp: +new Date() });
  res.redirect("/");
});

app.listen(process.env.PORT || 3000);

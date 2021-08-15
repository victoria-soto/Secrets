//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.use(express.static("public"));

// favicon
app.use('/favicon.ico', express.static('public/images/favicon.ico'));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

// render home
app.get("/", function(req, res){
res.render("home");
});

// render register
app.get("/register", function(req, res){
  res.render("register");
});

// render login
app.get("/login", function(req, res){
  res.render("login");
});

app.listen(3000, function(req, res){
  console.log("Server started on port 3000.");
});

//jshint esversion:6
// require for dotenv
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// mongoose package
const mongoose = require("mongoose");

// mongoose-encryption package
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// favicon
app.use('/favicon.ico', express.static('public/images/favicon.ico'));

// connect to mongoose db
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

// create new mongoose schema
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// encrypt user databse
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

// render home
app.get("/", function(req, res){
res.render("home");
});

// render register
app.get("/register", function(req, res){
  res.render("register");
});

// post method to register new users
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

// render login
app.get("/login", function(req, res){
  res.render("login");
});

// post method to check credentials of existing users
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, function(err, foundUser){
    if(err) {
      console.log(err);
    } else {
      if(foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function(req, res){
  console.log("Server started on port 3000.");
});

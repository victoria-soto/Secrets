//jshint esversion:6
// require for dotenv
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// mongoose package
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

// favicon
app.use('/favicon.ico', express.static('public/images/favicon.ico'));

// establish a session
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

// initialize passport and use it to set up a session
app.use(passport.initialize());
app.use(passport.session());

// connect to mongoose db
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// addresses deprication warning: collection.ensureIndex is deprecated
mongoose.set('useCreateIndex', true);

// create new mongoose schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// add passport-local-mongoose into mongoose schema as a plugin
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

// Configuration of passport-local-mongoose
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// render home
app.get("/", function(req, res) {
  res.render("home");
});

// render register
app.get("/register", function(req, res) {
  res.render("register");
});

// secrets route
app.get("/secrets", function(req, res) {

  // check if user is authenticated
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

// get method for logout
app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
});

// post method to register new users
app.post("/register", function(req, res) {

  // passport-local-mongoose
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
});

// render login
app.get("/login", function(req, res) {
  res.render("login");
});

// post method to check credentials of existing users
app.post("/login", function(req, res) {

// create new user
const user = new User({
  username: req.body.username,
  password: req.body.password
});

// passport login authentication
req.login(user, function(err){
  if(err){
    console.log(err);
  } else {
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secrets");
    });
  }
});

});

app.listen(3000, function(req, res) {
  console.log("Server started on port 3000.");
});

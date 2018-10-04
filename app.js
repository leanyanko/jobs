var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

const url = config.mongoUrl;
var db = mongoose.connect(
  url
);

var Job = require("./models/job");
var users = require ('./routes/users');
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use('/users', users);


var jobRouter = express.Router();
jobRouter = require("./routes/job-router")(Job);

var uploadRouter = require('./routes/uploadRouter');

app.use("/jobs", jobRouter);

app.use("/upload", uploadRouter);

app.get("/", function(req, res) {
  res.send("welcome to my api");
});

module.exports = app;
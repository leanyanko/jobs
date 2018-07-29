var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

var db = mongoose.connect(
  "mongodb://heroku_8r5bwnlw:ruup4j4krv9pr1j75m9ghi7rrm@ds125021.mlab.com:25021/heroku_8r5bwnlw"
);

var Job = require("./models/job");
var users = require ('./routes/users');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const key = '1234-5678-90';
//app.use(cookieParser(key));
app.use(session({
  name: 'session-id',
  secret: key,
  saveUninitialized: false,
  resave: false,
  store: new fileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

// AUTHENTICATION
  
app.use('/users', users);
function auth (req, res, next) {
 console.log(req.session);

// if (!req.session.user) {
  if (!req.user) {
  //  var authHeader = req.headers.authorization;
  //   if (!authHeader) {
        var err = new Error('You are not authenticated!');
       // res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 403;
        return next(err);
       // return;
    }

    // var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    // var user = auth[0];
    // var pass = auth[1];
    // if (user == 'admin' && pass == 'password') {
    //  // res.cookie('user', 'admin', {signed: true});
    //  req.session.user = 'admin';
    //     next(); // authorized
    // } else {
    //     var err = new Error('You are not authenticated!');
    //     res.setHeader('WWW-Authenticate', 'Basic');      
    //     err.status = 401;
    //     next(err);
    // }
  // }
  else {
     // if (req.signedCookies.user === 'authenticated') {
  //    if (req.session.user === 'authenticated') {
        next();
    //   } 
    //   else {
    //     var err = new Error('You are not authenticated!');
    //   //  res.setHeader('WWW-Authenticate', 'Basic');
    //     err.status = 403;
    //     return next(err);
    //  // }
    // }
  }
}

app.use(auth);

// EVERYTHING AFTER IS AFTER AUTH

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var jobRouter = express.Router();
jobRouter = require("./routes/job-router")(Job);

app.use("/jobs", jobRouter);

app.get("/", function(req, res) {
  res.send("welcome to my api");
});

app.listen(port, function() {
  console.log("Running port " + port);
});

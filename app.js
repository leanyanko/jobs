var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var createError = require('http-errors');
//var fs =  require('session-file-store')(session);//require('fs');

const url = config.mongoUrl;
var db = mongoose.connect(
  url
    //  url, {
    //    useMongoClient: true
    //  }
  // "mongodb://heroku_8r5bwnlw:ruup4j4krv9pr1j75m9ghi7rrm@ds125021.mlab.com:25021/heroku_8r5bwnlw"
);

var Job = require("./models/job");
var users = require ('./routes/users');
var app = express();
//
// app.all('*', (req, res, next) => {
//   if(req.secure) {
//     return next();
//   }
//   else {
//     res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//   }
// });
//var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const key = '1234-5678-90';
//app.use(cookieParser(key));

// app.use(session({
//   name: 'session-id',
//   secret: key,
//   saveUninitialized: false,
//   resave: false,
//   store: new fileStore()
// }));

app.use(passport.initialize());
//app.use(passport.session());

// AUTHENTICATION
  
 app.use('/users', users);

// app.use(express.static(path.join(__dirname, 'public')));
// function auth (req, res, next) {
//  console.log(req.session);

//   if (!req.user) {
//         var err = new Error('You are not authenticated!');
//         err.status = 403;
//         return next(err);
//     }
//   else {
//         next();
//   }
// }

// app.use(auth);

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

// app.listen(port, function() {
//   console.log("Running port " + port);
// });

module.exports = app;
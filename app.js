var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var db = mongoose.connect(
  "mongodb://heroku_8r5bwnlw:ruup4j4krv9pr1j75m9ghi7rrm@ds125021.mlab.com:25021/heroku_8r5bwnlw"
);

var Job = require("./models/job");
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json);

var jobRouter = express.Router();
jobRouter
  .route("/Jobs")
  .post(function(re, res) {
    var job = new Job();
  })
  .get(function(re, res) {
    var query = {};
    if (req.query.company) {
      query.company = req.query.company;
    }

    if (req.query.title) {
      query.title = req.query.title;
    }

    if (req.query.department) {
      query.department = req.query.department;
    }

    if (req.query.group) {
      query.group = req.query.grpup;
    }

    Job.find(query, function(err, jobs) {
      if (err) console.log(err);
      else res.json(jobs);
    });
  });

jobRouter.route("/jobs/:jobId").get(function(re, res) {
  Job.findById(req.params.jobId, function(err, job) {
    if (err) console.log(err);
    else res.json(job);
  });
});

app.use("/api", jobRouter);

//
app.get("/", function(req, res) {
  res.send("welcome to my api");
});

app.listen(port, function() {
  console.log("Running port " + port);
});

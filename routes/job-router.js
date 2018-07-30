var express = require("express");
const authenticate = require('../authenticate');

var routes = function(Job) {
  var jobRouter = express.Router();

  var jobController = require("../controllers/jobController")(Job);
  jobRouter
    .route("/")
    .post(authenticate.verifyUser, jobController.post)
    .get(jobController.get)
    .delete(authenticate.verifyUser, function(req, res) {
      Job.find(function(err, jobs) {});
    });

  jobRouter.use("/:jobId", function(req, res, next) {
    Job.findById(req.params.jobId, function(err, job) {
      if (err) res.status(500).send(err);
      else if (job) {
        req.job = job;
        next();
      } else {
        res.status(404).send("no job found");
      }
    });
  });

  jobRouter
    .route("/:jobId")
    .get(function(req, res) {
      res.json(req.job);
    })
    .put(authenticate.verifyUser, function(req, res) {
      req.job.title = req.body.title;
      req.job.text = req.body.text;
      if (req.body.images) req.job.images.push(req.body.images);

      req.job.save(function(err) {
        if (err) res.status(500).send(err);
        else res.json(req.job);
      });
      res.json(req.job);
    })
    .patch(authenticate.verifyUser, function(req, res) {
      if (req.body._id) delete req.body._id;
      for (p in req.body) {
        req.job[p] = req.body[p];
      }
      req.job.save(function(err) {
        if (err) res.status(500).send(err);
        else res.json(req.job);
      });
    })
    .delete(authenticate.verifyUser, function(req, res) {
      req.job.remove(function(err) {
        if (err) res.status(500).send(err);
        else res.status(204).send("removed");
      });
    });
  return jobRouter;
};

module.exports = routes;

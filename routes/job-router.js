var express = require("express");

var routes = function(Job) {
  var jobRouter = express.Router();

  var jobController = require("../controllers/jobController")(Job);
  jobRouter
    .route("/")
    .post(jobController.post)
    .get(jobController.get)
    .delete(function(req, res) {
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
    .put(function(req, res) {
      req.job.title = req.body.title;
      req.job.text = req.body.text;
      if (req.body.images) req.job.images.push(req.body.images);

      req.job.save(function(err) {
        if (err) res.status(500).send(err);
        else res.json(req.job);
      });
      res.json(req.job);
    })
    .patch(function(req, res) {
      if (req.body._id) delete req.body._id;
      for (p in req.body) {
        req.job[p] = req.body[p];
      }
      req.job.save(function(err) {
        if (err) res.status(500).send(err);
        else res.json(req.job);
      });
    })
    .delete(function(req, res) {
      req.job.remove(function(err) {
        if (err) res.status(500).send(err);
        else res.status(204).send("removed");
      });
    });
  return jobRouter;
};

module.exports = routes;

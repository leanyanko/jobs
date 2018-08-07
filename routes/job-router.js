var express = require("express");
const authenticate = require('../authenticate');

var cors = require('./cors');

var routes = function(Job) {
    var jobRouter = express.Router();
    var jobController = require("../controllers/jobController")(Job);

    jobRouter
        .route("/")
        .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

        .post(cors.corsWithOptions, authenticate.verifyUser, jobController.post)
        .get(cors.cors, jobController.get)
        .delete(cors.corsWithOptions, authenticate.verifyUser, function(req, res) {
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
      .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

      .get(cors.cors, function(req, res) {
          res.json(req.job);
        })
      .put(cors.corsWithOptions, authenticate.verifyUser, function(req, res) {
          req.job.title = req.body.title;
          req.job.text = req.body.text;
          if (req.body.images) req.job.images.push(req.body.images);

          req.job.save(function(err) {
            if (err) res.status(500).send(err);
            else res.json(req.job);
          });
          res.json(req.job);
        })
      .patch(cors.corsWithOptions, authenticate.verifyUser, function(req, res) {
          if (req.body._id) delete req.body._id;
          for (p in req.body) {
            req.job[p] = req.body[p];
          }
          req.job.save(function(err) {
            if (err) res.status(500).send(err);
            else res.json(req.job);
          });
        })
      .delete(cors.corsWithOptions, authenticate.verifyUser, function(req, res) {
          req.job.remove(function(err) {
            if (err) res.status(500).send(err);
            else res.status(204).send("removed");
          });
        });
      return jobRouter;
};

module.exports = routes;

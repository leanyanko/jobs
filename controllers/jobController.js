var jobController = function(Job) {
  var post = function(req, res) {
    var job = new Job(req.body);
    job.date = Date.now();
    job.save();
    console.log(job);
    res.status(201).send(job);
  };

  var get = function(req, res) {
    //  var query = req.query;
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
      if (err) res.status(500).send(err);
      else {
        res.json(jobs);
      }
    });
  };

  return {
    post: post,
    get: get
  };
};

module.exports = jobController;

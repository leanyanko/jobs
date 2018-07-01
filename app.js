var express = require('express');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://ds125021.mlab.com:25021/heroku_8r5bwnlw');

var Job = require('./models/job');
var app = express();
var port = process.env.PORT || 3000;

var jobRouter = express.Router();
jobRouter.route('/Jobs')
    .get(function (re, res) {
        var responseJson = {hello: 'api'};
        Job.find(function(err, jobs) {
            if(err)
                console.log(err);
            else
                res.json(jobs);
        });
        
    });

app.use('/api', jobRouter); 

//
app.get('/', function(req, res) {
    res.send('welcome to my api');
});

app.listen(port, function() {
    console.log('Running port ' + port);
});
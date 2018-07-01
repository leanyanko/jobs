var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

var jobRouter = express.Router();
jobRouter.route('/Jobs')
    .get(function (re, res) {
        var responseJson = {hello: 'api'};
        res.json(responseJson);
    });

app.use('/api', jobRouter); 

app.get('/', function(req, res) {
    res.send('welcome to my api');
});

app.listen(port, function() {
    console.log('Running port ' + port);
});
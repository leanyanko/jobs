var express= require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();

router.use(bodyParser.json());

router.get('/', function(req, res, next){
    res.send('respond with resourse');
});

router.post('/signup', function(req, res, next) {
    User.findOne({ username: req.body.username})
    .then((user) => {
        if(user != null) {
            var err = new Error ('User ' + req.body.username + ' already exists');
            err.status = 403;
            next(err); 
        }
        else {
            return User.create({
                username: req.body.username,
                password: req.body.password
             });
        }
    })
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Registration successfull', user: user});
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({ username: username })
    .then((user) => {
        if (user != null && user.username === username && user.password === password) {
        // res.cookie('user', 'admin', {signed: true});
            req.session.user = 'authenticated';
            res.statusCode = 200;
           // res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Type', 'text/plain');
            res.end('You are logged in');
        //    next(); // authorized
        } 
        else {
            //console.log(usernme);
            var string = user != null && (user.password !== password) ?
                'Password is incorrect' : 
                'User ' + username + ' doesn\'t exist' ;
            var err = new Error(string);
            res.setHeader('WWW-Authenticate', 'Basic');      
            err.status = 403;
            next(err);  
        }
        // else if (user.password !== password) {
        //     var err = new Error('Password is incorrect');
        //     res.setHeader('WWW-Authenticate', 'Basic');      
        //     err.status = 403;
        //     next(err);
        // }
        // else {
        //     var err = new Error('You are not authenticated!');
        //     res.setHeader('WWW-Authenticate', 'Basic');      
        //     err.status = 401;
        //     next(err);
        // }
    })
    .catch((err) => next(err));
  }
  else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already in'); 
  }

});



router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else {
        var err = new Error('You are not logged in');
        err.status = 403;
        next(err);
    }
});

module.exports = router;
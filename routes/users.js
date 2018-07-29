var express= require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');

router.use(bodyParser.json());

router.get('/', function(req, res, next){
    res.send('respond with resourse');
});

router.post('/signup', function(req, res, next) {
    // User.findOne({ username: req.body.username})
    User.register( new User({ username: req.body.username}), 
        req.body.password, (err, user) => {
    //.then((user) => {
        if(err) {//(user != null) {
            // var err = new Error ('User ' + req.body.username + ' already exists');
            // err.status = 403;
            // next(err); 
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        }
        else {
            // return User.create({
            //     username: req.body.username,
            //     password: req.body.password
            //  });
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({  
                    success: true, 
                    status: 'Registration successfull'
                });
            });
        }
    });
    // .then((user) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json({status: 'Registration successfull', user: user});
    // }, (err) => next(err))
    //.catch((err) => next(err));
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({  
        success: true, 
        status: 'You are successfully logged in'
    });
// if (!req.session.user) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         next(err);
//         return;
//     }

//     var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var username = auth[0];
//     var password = auth[1];

//     User.findOne({ username: username })
//     .then((user) => {
//         if (user != null && user.username === username && user.password === password) {
//         // res.cookie('user', 'admin', {signed: true});
//             req.session.user = 'authenticated';
//             res.statusCode = 200;
//            // res.setHeader('Content-Type', 'application/json');
//             res.setHeader('Content-Type', 'text/plain');
//             res.end('You are logged in');
//         //    next(); // authorized
//         } 
//         else {
//             //console.log(usernme);
//             var string = user != null && (user.password !== password) ?
//                 'Password is incorrect' : 
//                 'User ' + username + ' doesn\'t exist' ;
//             var err = new Error(string);
//             res.setHeader('WWW-Authenticate', 'Basic');      
//             err.status = 403;
//             next(err);  
//         }
//         // else if (user.password !== password) {
//         //     var err = new Error('Password is incorrect');
//         //     res.setHeader('WWW-Authenticate', 'Basic');      
//         //     err.status = 403;
//         //     next(err);
//         // }
//         // else {
//         //     var err = new Error('You are not authenticated!');
//         //     res.setHeader('WWW-Authenticate', 'Basic');      
//         //     err.status = 401;
//         //     next(err);
//         // }
//     })
//     .catch((err) => next(err));
//   }
//   else {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'text/plain');
//       res.end('You are already in'); 
//   }

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
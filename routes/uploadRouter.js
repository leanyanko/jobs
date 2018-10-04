const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

var AWS = require('aws-sdk');
//var fs = require('fs');

// For dev purposes only
AWS.config.update({ accessKeyId: '', secretAccessKey: '' });


const multer = require('multer');


var s3 = new AWS.S3();

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|png|png|gif)$/)) {
        return cb(new Error('This kind of files are unsupported'), false);
    }

    cb(null, true);
}


const memoryStorage = multer.memoryStorage();

const upload = multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter
});



const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.post(upload.single('imageFile'), (req, res) => {

    const binary = req.file.buffer;

    s3.putObject({
        Bucket: 'essteem-dev',
        Key: req.file.originalname,
        Body: binary,
        ACL: 'public-read'
    },function (err, data) {
        if (err) {
            console.log('err', err);
            res.statusCode = 400;
            res.send("Error:" + err);
            return;
        }
        console.log('Successfully uploaded package.');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ name: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size });
    });
    
});

module.exports = uploadRouter;
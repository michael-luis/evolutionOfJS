var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    prerender = require('prerender-node');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

MongoClient.connect('mongodb://localhost:27017/album', function(err, db) {
    "use strict";
    if (err) throw err;

    app.use(prerender.set('prerenderServiceUrl', 'http://localhost:3000/').set('prerenderToken', '0x1i50KRKpVzqfTqkP8p'));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(express.static(path.join(__dirname, 'public')));

    // default index page
    app.get('/', function (req, res) {
        res.sendFile("/index.html");
    });

    // get all albums
    app.get('/api/albums', function (req, res) {
        db.collection('albums').find().toArray(function(err, items) {
            res.send(items);
        });
    });

    // create album
    app.post('/api/albums', function(req, res) {
        var album = req.body;
        db.collection('albums').insertOne(album, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred when creating album'});
            } else {
                console.log('Success: ', result.ops[0]);
                res.send(result.ops[0]);
            }
        });
    });

    // get all images
    app.get('/api/images', function (req, res) {
        db.collection('images').find().toArray(function(err, items) {
            res.send(items);
        });
    });

    // upload an image
    app.post('/api/images', upload.single('image'), function(req, res) {
        var file = req.file;
        var album = JSON.parse(req.body.album);

        var image = {
            "name": req.body.name,
            "email": req.body.email,
            "file_name": file.originalname,
            "album_id": new ObjectID(album._id)
        };

        db.collection('images').insertOne(image, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred when uploading image'});
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.listen(4000, function () {
        console.log('Album App is running on port 4000');
    });
});
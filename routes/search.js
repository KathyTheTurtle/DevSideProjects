var MongoClient = require('mongodb').MongoClient
var geocoder = require('geocoder');
var assert = require('assert');
var express = require('express');
var router = express.Router();
var session = require('client-sessions');

// Connection URL
var url = 'mongodb://localhost:27017/devsideprojects';

router.get('/', function(req, res, next) {
  var long = req.session.user[0].location.coordinates[0];
  var lat = req.session.user[0].location.coordinates[1];

  res.render('search', { lat: lat, long: long });
});

router.post('/', function(req, res, next) {
  var long = req.session.user[0].location.coordinates[0];
  var lat = req.session.user[0].location.coordinates[1];

  var maxDistance = parseInt(req.body.maxDistance) * 1000;
  console.log("maxDistance");
  console.log(maxDistance);

  var query = { location: { $nearSphere: { $geometry: { 
    type: "Point", coordinates: [long, lat] }, $maxDistance: maxDistance } } };
  MongoClient.connect(url, function(err, db) {
    findUsers(db, query, function(result) {
    });
  });

});

var findUsers = function(db, query, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Find some documents
  console.log(query);
  collection.createIndex({ location: "2dsphere" });
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });      
}

module.exports = router;

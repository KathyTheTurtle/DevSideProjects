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
  var wantedLanguageSkillset = makeArray(req.body.language);
  var wantedFrameworkSkillset = makeArray(req.body.framework);
  var wantedDatabaseSkillset = makeArray(req.body.database);

  var query = { location: { $nearSphere: { $geometry: { 
    type: "Point", coordinates: [long, lat] }, $maxDistance: maxDistance } },
     };

  MongoClient.connect(url, function(err, db) {
    findUsers(db, query, function(result) {

      var points;

      for (var i = 0; i < result.length; i++) {
        points = 0;
        points += countMatches(result[i].skillset.languages, wantedLanguageSkillset);
        points += countMatches(result[i].skillset.frameworks, wantedFrameworkSkillset);
        points += countMatches(result[i].skillset.databases, wantedDatabaseSkillset);
        
        result[i].points = points;
      }
      result.sort(compare);

      res.send(result);
    });
  });

});

var compare = function(a, b) {
  if (a.points < b.points)
    return 1;
  if (a.points > b.points)
    return -1;
  return 0;
}

var countMatches = function(userSkills, wantedSkills) {
  matchingSkills = 0;
  userSkills = userSkills.sort();

  for (var i = 0; i < wantedSkills.length; i++) {
    if (binarySearch(userSkills, wantedSkills[i])) 
      matchingSkills++;
  }
  
  return matchingSkills;
}

var binarySearch = function(A, i) {
  var mid, low=0, high=A.length - 1;

  if (A.length == 0)
    return false;

  while (high > low) {
    mid = Math.floor((low+high)/2);
    if (i <= A[mid]) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  if (A[low] == i)
    return true;
  else
    return false;
}

var makeArray = function(result) {
  if (!result) 
    return [];
  else if (typeof(result) === 'string') 
    return [result];
  else 
    return result;
}

var findUsers = function(db, query, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Find some documents
  console.log("Search query");
  console.log(query);
  collection.createIndex({ location: "2dsphere" });
  collection.find(query, {username: 0}).toArray(function(err, result) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(result);
    callback(result);
  });      
}

module.exports = router;

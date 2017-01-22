var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var express = require('express');
var router = express.Router();
var session = require('client-sessions');

// Connection URL
var url = 'mongodb://localhost:27017/devsideprojects';

router.get('/', function(req, res, next) {
  var checkedData = {
    python: "",
    java: "",
    c: "",
    reactjs: "",
    nodejs: "",
    expressjs: "",
    mongodb: "",
    mysql: ""
  }

  if (!req.session.user[0]) {
    res.redirect('/');
  }

  var findUserQuery = { 
      username: req.session.user[0].username
  };

  MongoClient.connect(url, function(err, db) {
    findUser(db, findUserQuery, function(user) {
      var languages = user[0].skillset.languages;
      var frameworks = user[0].skillset.frameworks;
      var databases = user[0].skillset.databases;

      var i;
      for (i = 0; i < languages.length; i++) {
        checkedData[languages[i]] = "checked";
      }
      for (i = 0; i < frameworks.length; i++) {
        checkedData[frameworks[i]] = "checked";
      }
      for (i = 0; i < databases.length; i++) {
        checkedData[databases[i]] = "checked";
      }

      console.log("checkedData", checkedData);

      res.render('profile', checkedData);
    });
  });
});

router.post('/', function(req, res, next) {
  var username = req.session.user[0].username;
  var languages = makeArray(req.body.language);
  var frameworks = makeArray(req.body.framework);
  var databases = makeArray(req.body.database);

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server POST");

    var updateQuery = {
      languages: languages, 
      frameworks: frameworks, 
      databases: databases
    }

    updateUser(db, username, updateQuery, function(result) {
      res.redirect('/profile');
    });
  });
});

var findUser = function(db, query, callback) {
  // Get the users collection
  var collection = db.collection('users');

  // Find some documents
  console.log(query);
  collection.find(query).toArray(function(err, user) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(user);
    callback(user);
  });      
}

var updateUser = function(db, user, updateQuery, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ username : user }, { $set: {skillset: updateQuery} }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Update successful");
    callback(result);
  });  
}

var makeArray = function(result) {
  if (!result) 
    return [];
  else if (typeof(result) === 'string') 
    return [result];
  else 
    return result;
}

module.exports = router;
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var express = require('express');
var router = express.Router();
var session = require('client-sessions');

// Connection URL
var url = 'mongodb://localhost:27017/devsideprojects';

router.get('/', function(req, res, next) {
	res.render('index');
});

router.post('/', function(req, res, next) {
  console.log("req.body: ", req.body);

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Successfully connected to DB via POST to /");

    var findUserQuery = { 
      username: req.body.username, 
      password: req.body.password 
    };

    findUser(db, { username: findUserQuery.username }, function(user) {
      if (user.length != 0) {
      	findUser(db, findUserQuery, function(user) {
      		if (user.length != 0) {  
            req.session.user = user;
            res.redirect('search');
      		} else {
      			res.send("Incorrect password");
      		}
      	})
      } else {
      	res.send("User doesn't exist");
      }
      db.close();
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

module.exports = router;

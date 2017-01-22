var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var express = require('express');
var router = express.Router();
var session = require('client-sessions');

// Connection URL
var url = 'mongodb://localhost:27017/devsideprojects';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});


router.post('/', function(req, res, next) {
  console.log(req.body);
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server POST");

    findUser(db, { username: req.body.username }, function(user) {
      if (user.length != 0) {
      	findUser(db, { username: req.body.username, password: req.body.password }, function(user) {
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
  // Get the documents collection
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

var insertDocuments = function(db, reqbody, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Insert some documents
  collection.save(reqbody, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted the document into the collection");
    callback(result);
  });
}

module.exports = router;

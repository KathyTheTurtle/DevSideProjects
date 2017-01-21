var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var express = require('express');
var router = express.Router();

// Connection URL
var url = 'mongodb://localhost:27017/devsideprojects';

router.get('/', function(req, res, next) {
	res.render('register');
});

router.post('/', function(req, res, next) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;

	// Use connect method to connect to the server
 	MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server POST");

		findUser(db, { username: username }, function(result) {
	      if (result.length == 0) {
	      	findUser(db, { email: email }, function(result) {
	      		if (result.length == 0) {
	      			insertUser(db, {username: username, email: email, password: password}, function(result) {
	      				res.send("Registration successful");
	      				db.close();
	      			})
	      		} else {
	      			res.send("An account with this email already exists");
	      		}
	      	})
	      } else {
	      	res.send("An account with this username already exists");
	      }
	    });
	});
});

var findUser = function(db, query, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Find some documents
  console.log(query);
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });      
}

var insertUser = function(db, reqbody, callback) {
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

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var express = require('express');
var router = express.Router();

// Connection URL
var url = 'mongodb://localhost:27017/devsideprojects';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');

  // Use connect method to connect to the server
  /*MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
    console.log("Connected successfully to server GET");

    var query = {'firstname': 'annon'}
    findDocuments(db, query, function(query_result) {
      console.log("WE GOT BACK: ");
      console.log(query_result);
      res.render('index', { name: query_result[0].name });
      db.close();
    });
  });*/

});

router.post('/', function(req, res, next) {
  console.log(req.body);

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server POST");

    findUser(db, { username: req.body.username }, function(docs) {
      res.render('index');
      if (docs.length != 0) {
      	findUser(db, req.body, function(docs) {
      		if (docs.length != 0) {
      			res.send("Login successful");
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
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
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

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  temp = {}
  console.log("Entered /");
  // Connection URL
  var url = 'mongodb://localhost:27017/devsideprojects';

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
	console.log("Connected successfully to server");

	findDocuments(db, function(something) {
		console.log("WE GOT BACK: ");
		console.log(something);
		temp = something[0];
      res.render('index', { name: temp.firstname });
      db.close();
    });
  });

  /*console.log("TEMP: ");
  console.log(temp);
  res.render('index', { name: temp.firstname });*/
});

router.post('/', function(req, res, next) {
  console.log(req.body);

  // Connection URL
  var url = 'mongodb://localhost:27017/devsideprojects';
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server POST");

    insertDocuments(db, req.body, function() {
      db.close();
    });
  });

  //res.send(req.body);
  res.render('index', { name: 'Joyce' });
});

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({'firstname': 'Ass'}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });      
}

var insertDocuments = function(db, reqbody, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  console.log(reqbody);
  // Insert some documents
  collection.insertMany([
    reqbody
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

module.exports = router;

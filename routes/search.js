var MongoClient = require('mongodb').MongoClient
var geocoder = require('geocoder');
var assert = require('assert');
var express = require('express');
var router = express.Router();

// Connection URL
var url = 'mongodb://localhost:27017/devsideprojects';

router.get('/', function(req, res, next) {
	var results = [{name:"Bob Smith", email:"bob@example.com", skillset:"C++"}, {name:"John Doe", email:"bob@example.com", skillset:"C, C++, Python"}];
	res.render('search', {results: results});
});

router.post('/', function(req, res, next) {
});

module.exports = router;

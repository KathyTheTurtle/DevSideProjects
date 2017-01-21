var MongoClient = require('mongodb').MongoClient
var geocoder = require('geocoder');
var assert = require('assert');
var express = require('express');
var router = express.Router();
var session = require('client-sessions');

// Connection URL
var url = 'mongodb://localhost:27017/devsideprojects';

router.get('/', function(req, res, next) {
	console.log("req.session.user");
	console.log(req.session.username);
	res.render('search');
});

router.post('/', function(req, res, next) {
});

module.exports = router;


var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://Yotam:Yotam@ds023475.mlab.com:23475/small-talkz';
MongoClient.connect(url, function(err, db) {
	
	assert.equal(null, err);

	if (err) {
		console.log(err);
	}
	else{
		
		console.log("Yes");

	}
	var cursor =db.collection('mydb').updateOne( { "name":"id"},
		{$inc: { count: 1 } });
	var x;
	var cursor=db.collection('mydb').find( { "name":"id"} ) ;
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			x=doc.count;
			console.log(x);
		}  
	}); 
	console.log(x);
	console.log("Connected correctly to server.");
	db.close();
});

smallTalkzModel.controller('loginController', ['$scope', 'sessionInfo','$location',
	function($scope, sessionInfo, $location){ 

		$scope.updateMsg = function (info) {
			sessionInfo.set(info);
			$location.path("chat");
		}

		$scope.getMsg = function () {
			$scope.message = sessionInfo.get();
		}

	}]);
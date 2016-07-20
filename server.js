var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

app.use(express.static(path.join(__dirname, '/')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	io.emit('chat_message', "welcome");

	socket.on('room', function(room) {
		socket.join(room);
	});

	socket.on('chat_message', function(data){
		socket.broadcast.to(data.room).emit('chat_message',data.msg);
	});
	socket.on('info_message', function(data){
		socket.broadcast.to(data.room).emit('info_message',data.msg);
	});

	socket.on('disconnect', function(){
		io.emit('chat message', "Bye");

	}); 

});

http.listen((process.env.PORT || 3000), function(){
	console.log('listening on *:3000 '+ __dirname);
});

var url = 'mongodb://Yotam:Yotam@ds023475.mlab.com:23475/small-talkz';
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);

	var cursor =db.collection('users').find( { "count": { $gt: -1 } } );
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			 console.dir(doc);
		} else {
			 
		}
	}
	);
	console.log("Connected correctly to server.");
	db.close();
});
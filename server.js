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

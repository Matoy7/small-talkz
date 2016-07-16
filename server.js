var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
	res.sendFile('Index.html', { root: __dirname });
});

io.on('connection', function(socket){
	io.emit('chat_message', "welcome");

	socket.on('room', function(room) {
		socket.join(room);
	});

	socket.on('chat_message', function(data){
		io.sockets.in(data.room).emit('chat_message',data.msg);
	});
	socket.on('info_message', function(data){
		socket.broadcast.to(data.room).emit('info_message',data.msg);
	});

	socket.on('disconnect', function(){
		io.emit('chat message', "Bye");

	});

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
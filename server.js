var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);
var path = require('path');
var assert = require('assert');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var url = 'mongodb://Yotam:Yotam@ds023475.mlab.com:23475/small-talkz';
mongoose.connect(url);

//creating the model
var user_session_schema = mongoose.Schema({
	user_name: String,
	room_name:String
});
var User_session = mongoose.model('user_info', user_session_schema);

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

//get the cat named mike
app.get('/users', function(req, res){
	get_user(req, res);
});

var remove_user= function(user_name){
	User_session.find({'user_name':user_name}).remove().exec();
}  

var get_user= function(req, res){
	var query= User_session.find();
	query.exec( function(err, docs){
		res.json(docs);
		//mongoose.connection.close();

	});  

}

app.post('/users', function(req, res){
	add_user(req, res);
});


var add_user=function(req, res){

        // create a user, information comes from AJAX request from Angular
        var new_user_session= { "user_name": req.body.user_name, "room_name":req.body.room_name };
        User_session.create(new_user_session, function (err, user_session) {

        	if (err){
        		res.send(err);
        	}
            // get and return all the users after you create another
            User_session.find(function(err, user_sessions) {
            	if (err)
            		res.send(err)
            	res.json(user_sessions);
            });
        });

    }

    app.use(express.static(path.join(__dirname, '/')));

    app.get('/', function(req, res){
    	res.sendFile(__dirname + '/index.html');
    });

    io.on('connection', function(socket){

    	//io.emit('chat_message', "welcome ");

    	socket.on('room', function(room) {
    		socket.room=room;
    		socket.join(room);
    	});

    	socket.on('user', function(user) {
    		socket.user=user;
    	});

    	socket.on('chat_message', function(data){
    		socket.broadcast.to(data.room).emit('chat_message',data.msg);
    	});
    	socket.on('info_message', function(data){
    		socket.broadcast.to(data.room).emit('info_message',data.msg);
    	});

    	socket.on('disconnect', function(){
    		remove_user(socket.user);
    		console.log('Bye '+socket.user);
    		io.emit('chat message', "Bye");

    	}); 

    });

    http.listen((process.env.PORT || 3000), function(){
    	console.log('listening on *:3000 '+ __dirname);
    });

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
	user_name:String,
	room_name:String
});
var User_session = mongoose.model('user_info', user_session_schema);


var user_details_schema = mongoose.Schema(
{
    FirstName:String,
    LastName:String,
    Mail:String,
    Password:String
});

var user_details = mongoose.model('register_users', user_details_schema);





app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

//get the cat named mike
app.get('/online_users', function(req, res){
	get_user(req, res);
});

app.get('/rooms', function(req, res){
    get_room(req, res);
});

app.post('/online_users', function(req, res){
    add_online_user(req, res);
});




app.use(express.static(path.join(__dirname, '/')));

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});



app.post('/authenticate_user', function(req, res){

    authenticate_user(req, res);
});


app.post('/register_user', function(req, res){

    add_register_user(req, res);
});


var authenticate_user=function(req, res){

 var query= user_details.find({'Mail': req.body.Mail});

 res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
 query.exec( function(err, docs){

    if (docs.length==0) return res.json("false");
    res.json(docs[0].password==req.body.password);
});  
}




var remove_user= function(user_name){
 User_session.find({'user_name':user_name}).remove().exec();
}  

var get_user= function(req, res){

 var query= User_session.find();
 res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");


 query.exec( function(err, docs){

  res.json(docs);
		//mongoose.connection.close();

	});  

}
var add_online_user=function(req, res){

        // create a user, information comes from AJAX request from Angular
        var new_user_session= { "user_name": req.body.user_name, "room_name": req.body.room_name };
        User_session.create(new_user_session, function (err, user_session) {
            console.log(req.body.user_name);
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

    var add_register_user=function(req, res){

        // create a user, information comes from AJAX request from Angular
 
        var new_user_session= { "FirstName": req.body.FirstName, "LastName": req.body.LastName, 
        "Mail": req.body.Mail, "Password": req.body.Password };
        user_details.create(new_user_session, function (err, user_session) {
            if (err){
              res.send(err);
          }
            // get and return all the users after you create another
            user_details.find(function(err, user_sessions) {
                if (err)
                    res.send(err)
                res.json(user_sessions);
            });
        });

    }

    var get_room= function(req, res){
        var query= User_session.find();
        query.exec( function(err, docs){
            randomIndex= Math.floor(Math.random() * docs.length)  
            console.log('randomIndex: '+randomIndex);
            res.json(docs[randomIndex]);
        //mongoose.connection.close();
    });
    };  




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

        socket.on('new_user', function(data){
            socket.broadcast.to(data.room).emit('handle_new_user',data);
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
        User_session.find({}).remove().exec();

        console.log('listening on *:3000 '+ __dirname);
    });

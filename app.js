var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});


app.get('/example', function(req, res){
  res.name="Mike";
  res.redirect('/example2?name='+res.name);
});

app.get('/example2', function(req, res){

  res.send("example2===>"+req.query.name);
});

io.on('connection', function(socket){
  console.log('a user connected');


  socket.on('chat message', function(msg){
    $scope.$apply(function() {
     $scope.message=$scope.message+" <li> "+ msg + "</li>";
   });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    $scope.messages.push(msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
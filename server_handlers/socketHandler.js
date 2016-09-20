 
var socketio = require('socket.io');

module.exports.listen = function(http, dbHandler){
    var io = require('socket.io')(http);
    io.on('connection', function(socket){

        socket.on('room', function(room) {
            socket.room=room;
            socket.join(room);
        });

        socket.on('user', function(user) {
            socket.user=user;
        });

        socket.on('authenticate_user', function(data){
            authenticate_user(data.Mail, data.Password).then(function(isValid){
                if (isValid){
                    socket.emit('login_succeeded');
                }
                else{
                    socket.emit('login_failed');
                }
            })
        });

        socket.on('register_user', function(data){
            add_register_user(data).then(function(isValid){
                if (isValid){
                    socket.emit('register_succeeded');
                }
                else{
                    socket.emit('register_failed');
                }
            })
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
         dbHandler.remove_user(socket.user);
         console.log('Bye '+socket.user);
         io.emit('chat message', "Bye");

     }); 

    });
    
    return io;
}
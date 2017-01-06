
var socketio = require('socket.io');

module.exports.listen = function (http, dbHandler) {
    var io = require('socket.io')(http);
    io.on('connection', function (socket) {
        var socket_user;
        var socket_room;
        socket.on('room', function (room) {
            socket.room = room;
            socket_room = room;
            console.log('Room ' + socket_room);
            socket.join(room);
        });

        socket.on('user', function (user) {
            socket_user = user;
            console.log('Hello ' + socket_user);

        });

        socket.on('chat_message', function (data) {
            socket.broadcast.to(data.room).emit('chat_message', data.msg);
        });

        socket.on('new_user', function (data) {
            socket.broadcast.to(data.room).emit('update_users', data.room);
        });

        socket.on('info_message', function (data) {
            socket.broadcast.to(data.room).emit('info_message', data.msg);
        });

        socket.on('disconnect', function () {
            if (socket_user && socket_room) {
                console.log("disconnect");
                dbHandler.remove_user_session(socket_user, socket_room).then(function () {
                    dbHandler.remove_user_from_room(socket_user, socket_room).then(function () {
                        socket.broadcast.to(socket_room).emit('update_users', socket_room);
                        dbHandler.get_users_in_room(socket_room).then(function (users_list) {
                            if (users_list.length == 0) {
                                                            console.log("empty " );

                                dbHandler.remove_room(socket_room).then(function () {

                                })

                            }
                        });
                        io.emit('chat message', "Bye");
                    });
                });
            }
        });
    });

    return io;
}
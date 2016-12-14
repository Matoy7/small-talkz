
var socketio = require('socket.io');

module.exports.listen = function (http, dbHandler) {
    var io = require('socket.io')(http);
    io.on('connection', function (socket) {
        var socket_user;
        socket.on('room', function (room) {
            socket.room = room;
            socket.join(room);
        });

        socket.on('user', function (user) {
            console.log('Hello ' + user);
            socket_user = user;
        });

        socket.on('chat_message', function (data) {
            socket.broadcast.to(data.room).emit('chat_message', data.msg);
        });

        socket.on('new_user', function (data) {
            socket.broadcast.to(data.room).emit('handle_new_user', data);
        });

        socket.on('info_message', function (data) {
            socket.broadcast.to(data.room).emit('info_message', data.msg);
        });

        socket.on('disconnect', function () {
            dbHandler.remove_user(socket_user);
            console.log('Bye' + socket_user);
            io.emit('chat message', "Bye");

        });

    });

    return io;
}
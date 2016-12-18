
var mongoose = require('mongoose');

//var url = 'mongodb://localhost:27017/small-talkz';
var url = 'mongodb://Yotam:Yotam@ds023475.mlab.com:23475/small-talkz';
mongoose.connect(url);


// ------- creating the user sessions model -------
var user_session_schema = mongoose.Schema({
    user_name: String,
    room_name: String
});
var user_session = mongoose.model('user_info', user_session_schema);

// ------- creating the register users model -------
var register_user_schema = mongoose.Schema({
    Mail: String,
    Password: String
});
var register_user = mongoose.model('register_users', register_user_schema);

// ------- creating active_rooms model -------
var active_rooms_schema = mongoose.Schema({
    name: String
});
var active_rooms = mongoose.model('active_rooms', active_rooms_schema);

module.exports = {
    remove_user_session: function (user_name,room_name) {
        user_session.find({ 'user_name': user_name, 'room_name':room_name }).remove().exec();
    },

    get_users: function () {
        return new Promise(function (resolve, reject) {
            user_session.find(function (err, users) {
                resolve(users);
            });
        })
    },

    get_rooms: function () {
        return new Promise(function (resolve, reject) {
             active_rooms.find(function (err, rooms) {

                resolve(rooms);
            });
        })
    },


    is_mail_already_exists: function (mail) {
        return new Promise(function (resolve, reject) {
            register_user.find({ Mail: mail }, function (err, found_mail) {
                resolve(found_mail.length != 0);
            });
        })
    },

    add_register_user: function (user) {

        return new Promise(function (resolve, reject) {
            var new_register_user = new register_user(user);
            new_register_user.save(function (err, user) {
                if (err)  {reject(err);}
                else{
                    resolve(user);
                }
            });
        })
    },


    is_room_already_exists: function (name) {

        return new Promise(function (resolve, reject) {
            active_rooms.findOne({ name: name }, function (err, found_room) {
                if (err)  {
                    reject(err);
                }
                else{
                    console.log("found_room "+found_room);
                    resolve(found_room!=null);
                }
            });
        })
    },

    register_room: function (room_name) {

        return new Promise(function (resolve, reject) {
            var new_active_room = new active_rooms({name: room_name});
            new_active_room.save(function (err, room) {
                if (err)  {reject(err);}
                else{
                    resolve(room);
                }
            });
        })
    },


    authenticate_user: function (mail, password) {
        return new Promise(function (resolve, reject) {
            register_user.findOne({ Mail: mail }, 'Password', function (err, user) {
                if (err) {
                    resolve(false);
                    return;
                }
                if (user==null){
                    resolve(false);
                    return;
                }
                else{
                    resolve(user.Password == password);
                    return;
                }
            });
        });

    },

    add_new_user_session: function (user_name, room_name) {
        var new_user_session = { "user_name": user_name, "room_name": room_name };
        return new Promise(function (resolve, reject) {
            var new_online_user = new user_session(new_user_session);
            new_online_user.save(function (err, user) {

                if (err)  {
                    reject(err);
                }
                else{
                    resolve(user);
                }
            });
        })
    },

    getUserByMail: function (mail) {
        return new Promise(function (resolve, reject) {
            register_user.find({ "Mail": mail }, function (err, new_user_session) {
                if (err) {
                    reject(err);
                }
                resolve(register_user);
            });
        })
    },

    remove_all_data: function () {
        user_session.find({}).remove().exec();
        active_rooms.find({}).remove().exec();
    },

    get_random_room: function () {
        var query = active_rooms.find();
        return new Promise(function (resolve, reject) {
            query.exec(function (err, docs) {
                randomIndex = Math.floor(Math.random() * docs.length);
                resolve(docs[randomIndex]);
                //mongoose.connection.close();
            });
        });
    }

};

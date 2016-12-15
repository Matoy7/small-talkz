
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/small-talkz';
//var url = 'mongodb://Yotam:Yotam@ds023475.mlab.com:23475/small-talkz';
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

module.exports = {
    remove_user: function (user_name) {
        user_session.find({ 'user_name': user_name }).remove().exec();
    },

    get_user: function () {
        return new Promise(function (resolve, reject) {
            var query = user_session.find();
            query.exec(function (err, docs) {
                resolve(docs);
            });
        })
    },

    is_mail_already_exists: function (new_user) {
        return new Promise(function (resolve, reject) {
            register_user.find({ Mail: new_user }, function (err, found_user) {
                resolve(found_user.length != 0);
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

    authenticate_user: function (mail, password) {

        var query = register_user.find({ 'Mail': mail });
        return new Promise(function (resolve, reject) {
            register_user.findOne({ 'Mail': mail }, 'Password', function (err, user) {
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

    add_online_user: function (user_name, room_name) {

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

        var new_user_session = { "Mail": mail };

        return new Promise(function (resolve, reject) {
            register_user.find(function (err, register_user) {
                if (err) {
                    reject(err);
                }
                resolve(register_user);
            });
        })
    },

    remove_all_data: function () {
        user_session.find({}).remove().exec();
    },

    get_random_room: function () {
        var query = user_session.find();
        return new Promise(function (resolve, reject) {
            query.exec(function (err, docs) {
                randomIndex = Math.floor(Math.random() * docs.length)
                resolve(docs[randomIndex]);
                //mongoose.connection.close();
            });
        });
    }

};

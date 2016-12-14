
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/small-talkz';
//var url = 'mongodb://Yotam:Yotam@ds023475.mlab.com:23475/small-talkz';
mongoose.connect(url);


//creating the model
var user_session_schema = mongoose.Schema({
  user_name: String,
  room_name: String
});
var user_session = mongoose.model('user_info', user_session_schema);


var user_details_schema = mongoose.Schema(
  {
    Mail: String,
    Password: String
  });
var user_details = mongoose.model('register_users', user_details_schema);

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
      user_details.find({ Mail: new_user }, function (err, found_user) {
        resolve(found_user.length != 0);
      });
    })
  },


  add_register_user: function (new_user) {

    return new Promise(function (resolve, reject) {
      user_details.create(new_user, function (err, new_user) {
        if (err) {
          reject(err);
        }
        user_details.find(function (err, new_user) {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    })
  },


  authenticate_user: function (mail, password) {


    var query = user_details.find({ 'Mail': mail });
    return new Promise(function (resolve, reject) {
      query.exec(function (err, docs) {
        if (docs.length == 0) {
          resolve(false);
        }
        else {
          resolve(docs[0].Password == password);
        }
      });
    });

  },

  add_online_user: function (user_name, room_name) {

    var new_user_session = { "user_name": user_name, "room_name": room_name };
    return new Promise(function (resolve, reject) {
      user_session.create(new_user_session, function (err, user_sessions) {
        if (err) {
          reject(err);
        }

        user_session.find(function (err, user_sessions) {
          if (err) {
            reject(err);
          }
          resolve(user_sessions);
        });
      });
    })
  },


  getUserByMail: function (mail) {

    var new_user_session = { "Mail": mail };

    return new Promise(function (resolve, reject) {
      user_details.find(function (err, user_details) {
        if (err) {
          reject(err);
        }
        resolve(user_details);
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




module.exports.getHttpHandler = function (dbHandler, app, jwt, expressJwt) {

    var secret = "smallTalkz rocks!";

    function createToken(user) {
        return jwt.sign(user, secret, { expiresInMinutes: 60 * 5 });
    }

    var jwtCheck = expressJwt({
        secret: "smallTalkz rocks!"
    });

    app.use('/decodeToken', jwtCheck);

    app.get('/decodeToken', function (req, res) {
        decodeToken(req, res, sendResWithDecodedToken);
    });



    var sendResWithDecodedToken = function (res, information) {
        if (information != null) {
            res.json(information);
        }
        else {
            res.json('Failed to authenticate token.');
        }
    }


    var decodeToken = function (req, res, next) {
        var token = req.get('Authorization').split("Bearer ")[1];

        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                console.log('Failed to authenticate token.');
                return next(res, null);
            } else {

                return next(res, decoded);
            }
        });
    }


    var getToken = function (req) {
        return req.get('Authorization').split("Bearer ")[1];
    }


    app.get('/get_random_room', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.get_random_room().then(function (room_name) {

            res.json(room_name);
        });
    });

    app.get('/online_users', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.get_online_users().then(function (online_users) {
            res.json(online_users);
        });
    });


   app.post('/add_online_user', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.add_online_user({"user_mail":req.body.user_mail}).then(function () {
            
        });;
    });

       app.post('/remove_online_user', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.remove_online_user(req.body.user_mail);
    });


    app.post('/remove_room', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.remove_room(req.body.room_name);
    });


    app.post('/remove_user_session', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.remove_user_session(req.body.user_name, req.body.room_name);
    });

 
    app.get('/online_rooms', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.get_rooms().then(function (online_rooms) {
            res.json(online_rooms);
        });
    });

    app.post('/get_users_in_room', function (req, res) {

        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.get_users_in_room(req.body.room_name).then(function (users_list) {
              
            res.json({ "users_list": users_list });
        });
    });

    app.post('/is_room_already_exists', function (req, res) {
     
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.is_room_already_exists(req.body.name).then(function (is_room_already_exists) {
             
            res.json({ is_room_exists: is_room_already_exists });
        });
    });

    app.post('/register_room', function (req, res) {
 
        dbHandler.register_room(req.body.name).then(function (new_room) {
            res.json(new_room);
        });
    });

        app.post('/add_user_to_room', function (req, res) {
 
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.add_user_to_room(req.body.user_name, req.body.room_name); 
    });

        app.post('/is_mail_already_exists', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
       
        dbHandler.is_mail_already_exists(req.body.Mail).then(function (is_mail_already_exists) {
            res.json({ is_mail_exists: is_mail_already_exists });
        });
    });
 


    app.post('/add_new_user_session', function (req, res) {
        dbHandler.add_new_user_session(req.body.user_name, req.body.room_name).then(function (new_user_session) {
            res.json(new_user_session);
        });
    });



    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });



    app.post('/authenticate_user', function (req, res) {
        var mail = req.body.Mail;
        var password = req.body.Password;

        var new_user_session = {
            "Mail": mail, "Password": password
        };
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.authenticate_user(mail, password).then(function (isValid) {
            if (isValid) {
                res.status(201).send({
                    id_token: createToken(new_user_session)
                });
            }
            else {
                res.status(401).send({});
            }
        }
        );
    });

    app.post('/register_user', function (req, res) {
        var new_user = {
            "Mail": req.body.Mail, "Password": req.body.Password
        };
        var allUsers = dbHandler.add_register_user(new_user).then(function () {

            res.status(201).send({
                id_token: createToken(new_user)
            });
        });
    });


    app.post('/getUserByMail', function (req, res) {
        getUserByMail(req.body.Mail).then(function (user_details) {
            res.json(user_details);
        });
    });




}

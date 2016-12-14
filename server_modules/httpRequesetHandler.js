


module.exports.getHttpRequestHandler = function (dbHandler, app, jwt, expressJwt) {

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



    app.get('/online_users', function (req, res) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
        dbHandler.get_user().then(function (online_users) {
            res.json(online_users);
        });
    });

    app.get('/rooms', function (req, res) {
        dbHandler.get_random_room().then(function (online_users) {
            res.json(online_users);
        });
    });

    app.post('/online_users', function (req, res) {
        dbHandler.add_online_user(req.body.user_name, req.body.room_name).then(function (online_users) {

            res.json(online_users);
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
        var new_user_session = {
            "Mail": req.body.Mail, "Password": req.body.Password
        };
        var allUsers = dbHandler.add_register_user(new_user_session).then(function (newUser) {

            res.status(201).send({
                id_token: createToken(new_user_session)
            });
        });
    });


    app.post('/getUserByMail', function (req, res) {
        getUserByMail(req.body.Mail).then(function (user_details) {
            res.json(user_details);
        });
    });




}




module.exports.getHttpRequestHandler = function(dbHandler, app){

   
//get the cat named mike
app.get('/online_users', function(req, res){
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
    dbHandler.get_user().then(function (online_users){
        res.json(online_users);
    });  
});

app.get('/rooms', function(req, res){
	dbHandler.get_random_room().then(function (online_users){
        res.json(online_users);
    });
});

app.post('/online_users', function(req, res){
  dbHandler.add_online_user(req.body.user_name, req.body.room_name).then(function (online_users){
   
    res.json(online_users);
});
});

app.get('/', function(req, res){
 res.sendFile(__dirname + '/index.html');
});



app.post('/authenticate_user', function(req, res){
 var mail = req.body.Mail;
 var password = req.body.Password;
 res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
 dbHandler.authenticate_user(mail, password).then( function (isValid){
  res.json(isValid);
}); 
});




app.post('/register_user', function(req, res){
 var new_user_session= { "FirstName": req.body.FirstName, "LastName": req.body.LastName, 
 "Mail": req.body.Mail, "Password": req.body.Password };
 var allUsers = dbHandler.add_register_user(new_user_session).then( function (newUser){
     res.json(newUser);
 }); 
});


app.post('/getUserByMail', function(req, res){
 getUserByMail(req.body.Mail).then( function (user_details){
  res.json(user_details);
}); 
});




}

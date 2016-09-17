


module.exports.getHttpRequestHandler = function(mongoose, app){

	var url = 'mongodb://Yotam:Yotam@ds023475.mlab.com:23475/small-talkz';
	mongoose.connect(url);


//creating the model
var user_session_schema = mongoose.Schema({
	user_name:String,
	room_name:String
});
var User_session = mongoose.model('user_info', user_session_schema);


var user_details_schema = mongoose.Schema(
{
	FirstName:String,
	LastName:String,
	Mail:String,
	Password:String
});

var user_details = mongoose.model('register_users', user_details_schema);




//get the cat named mike
app.get('/online_users', function(req, res){
	get_user(req, res);
});

app.get('/rooms', function(req, res){
	get_room(req, res);
});

app.post('/online_users', function(req, res){
	add_online_user(req, res);
});






app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});



app.post('/authenticate_user', function(req, res){
	var mail = req.body.Mail;
	var password = req.body.Password;
	res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
	authenticate_user(mail, password).then( function (isValid){

		res.json(isValid);
	}); 
});




app.post('/register_user', function(req, res){
	var new_user_session= { "FirstName": req.body.FirstName, "LastName": req.body.LastName, 
	"Mail": req.body.Mail, "Password": req.body.Password };
	var allUsers = add_register_user(new_user_session).then( function (allUsers){
		res.json(allUsers);
	}); 
});


app.post('/getUserByMail', function(req, res){
	getUserByMail(req, res);
});





var remove_user= function(user_name){
	User_session.find({'user_name':user_name}).remove().exec();
}  

var get_user= function(req, res){

	var query= User_session.find();
	res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");


	query.exec( function(err, docs){

		res.json(docs);
        //mongoose.connection.close();

    });  

}


var add_register_user=function(new_user_session){
	return new Promise(function(resolve, reject) {
        // create a user, information comes from AJAX request from Angular
        user_details.create(new_user_session, function (err, user_session) {
        	if (err){
        		reject (err);
        	}
            // get and return all the users after you create another
            user_details.find(function(err, user_sessions) {
            	if (err){
            		reject (err);
            	}
            	resolve (user_sessions);
            });
        });
    });

}


var authenticate_user=function(mail, password){
	var query = user_details.find({'Mail': mail});
	return new Promise(function(resolve, reject) {
		query.exec( function(err, docs){
			if (docs.length==0) {
				resolve (false);
			}
			else{
				resolve(docs[0].Password==password);
			}
		}); 
	});

}



var add_online_user=function(req, res){

        // create a user, information comes from AJAX request from Angular
        var new_user_session= { "user_name": req.body.user_name, "room_name": req.body.room_name };
        User_session.create(new_user_session, function (err, user_session) {
        	if (err){
        		res.send(err);
        	}
            // get and return all the users after you create another
            User_session.find(function(err, user_sessions) {
            	if (err)
            		res.send(err)
            	res.json(user_sessions);
            });
        });

    }




    var getUserByMail=function(req, res){

    	var new_user_session= { "Mail": req.body.Mail};
    	user_details.find(function(err, user_details) {
    		if (err)
    			res.send(err)
    		res.json(user_details);
    	});

    }


    var get_room= function(req, res){
    	var query= User_session.find();
    	query.exec( function(err, docs){
    		randomIndex= Math.floor(Math.random() * docs.length)  
    		console.log('randomIndex: '+randomIndex);
    		res.json(docs[randomIndex]);
        //mongoose.connection.close();
    });
    };  

}

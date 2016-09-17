var express = require('express');
var app = express();
var http = require('http').Server(app); 
var path = require('path');
var assert = require('assert');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

var httpRequesetHandler = require('./server_handlers/httpRequesetHandler.js').getHttpRequestHandler(mongoose, app);


var io = require('./server_handlers/socketHandler.js').listen(http, httpRequesetHandler);


    http.listen((process.env.PORT || 3000), function(){
    	//User_session.find({}).remove().exec();

    	console.log('listening on *:3000 '+ __dirname);
    });

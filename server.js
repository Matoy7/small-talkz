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

var dbHandler = require('./server_handlers/dbHandler.js');
var httpRequesetHandler = require('./server_handlers/httpRequesetHandler.js').getHttpRequestHandler(dbHandler, app);

 

var io = require('./server_handlers/socketHandler.js').listen(http, dbHandler);


    http.listen((process.env.PORT || 3000), function(){
    	 dbHandler.get_random_room();

    	console.log('listening on *:3000 '+ __dirname);
    });

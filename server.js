
 // ---------------- define third Party dependencies)
 var express = require('express');
 var app = express();
 var http = require('http').Server(app); 
 var path = require('path');
 var assert = require('assert');
 var mongoose = require('mongoose');
 var bodyParser = require('body-parser');
 var jwt = require('jsonwebtoken'); 
 var expressJwt = require('express-jwt'); 
 var secret = 'ssasDSA223Sasdas2sdsa23123dvxcgyew231';
 
 // ---------------- config the app
 app.use(bodyParser.urlencoded({
 	extended: true
 }));
 
 app.use(bodyParser.json());
 app.use(express.static(path.join(__dirname, '/')));

 app.use('/restricted', expressJwt({secret: secret}));


 // ---------------- define the server handlers (internal dependencies)
 var dbHandler = require('./server_modules/dbHandler.js');
 var httpRequesetHandler = require('./server_modules/httpRequesetHandler.js').getHttpRequestHandler(dbHandler, app);
 var io = require('./server_modules/socketHandler.js').listen(http, dbHandler);

 // ---------------- start the server
 http.listen((process.env.PORT || 3000), function(){
 	dbHandler.get_random_room();
 	console.log('listening on *:3000 '+ __dirname);
 });

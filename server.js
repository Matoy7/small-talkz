
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




// ---------------- config the app
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use('/',express.static(path.join(__dirname, '/public')));
  

// ---------------- define the server handlers (internal dependencies)
var dbHandler = require('./server_handlers/dbHandler.js');
var httpRequesetHandler = require('./server_handlers/httpHandler.js').getHttpHandler(dbHandler, app, jwt, expressJwt);
var io = require('./server_handlers/socketHandler.js').listen(http, dbHandler);

// ---------------- start the server
var listen_port=(process.env.PORT || 3000);
http.listen(listen_port, function () {
	dbHandler.remove_all_data();
	console.log('listening on port: ' +listen_port);
});

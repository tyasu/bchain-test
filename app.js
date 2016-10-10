/*eslint-env node*/

//------------------------------------------------------------------------------
// opEx1 application
//------------------------------------------------------------------------------

var express = require( 'express' );
var http = require('http');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require( 'cfenv' );
//var setup = require('./setup');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use( express.static( __dirname + '/public' ) );
/*
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public'+'/menu.html');
});
*/

// get the app environment from Cloud Foundry
// var appEnv = cfenv.getAppEnv();
var appPort = ( process.env.VCAP_APP_PORT || 3000 );
var appHost = ( process.env.VCAP_APP_HOST || 'localhost' );

console.log(process.env.VCAP_APP_HOST);

// body-parser
var bodyParser = require( 'body-parser' );
app.use( bodyParser.urlencoded( {
  extended: true
} ) );
app.use( bodyParser.json() );
//set routes
require( './config/routes' )( app );
//libraries
app.use( '/libs', express.static( __dirname + '/node_modules' ) );

// start server on the specified port and binding host
var server = http.createServer(app).listen( appPort, appHost, function() {
  // print a message when the server starts listening
  console.log( "server starting on " + appHost + ":" + appPort );
} );
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log(server);
exports.server = server;
exports.appPort = appPort;
exports.appHost = appHost;

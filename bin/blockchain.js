var serv = require('../app'); //websocket message processing
var bchain = require('../utils/ws.js');
var ws = require('ws');																		//websocket mod
var wss = {};
var Ibc1 = require('ibm-blockchain-js');
var ibc = new Ibc1();
var chaincode = {};
var server = serv.server;


// ==================================
// configure ibc-js sdk
// ==================================

// ---- Load From VCAP aka Bluemix Services ---- //
if (process.env.VCAP_SERVICES) { //load from vcap, search for service, 1 of the 3 should be found...
	var servicesObject = JSON.parse(process.env.VCAP_SERVICES);
	for (var i in servicesObject) {
		if (i.indexOf('ibm-blockchain') >= 0) {
			if (servicesObject[i][0].credentials.error) {
				console.log('!\n!\n! Error from Bluemix: \n', servicesObject[i][0].credentials.error, '!\n!\n');
				peers = null;
				users = null;
				process.error = {
					type: 'network',
					msg: 'Due to overwhelming demand the IBM Blockchain Network service is at maximum capacity.  Please try recreating this service at a later date.'
				};
			}
			if (servicesObject[i][0].credentials && servicesObject[i][0].credentials.peers) { //found the blob, copy it to 'peers'
				console.log('overwritting peers, loading from a vcap service: ', i);
				peers = servicesObject[i][0].credentials.peers;
				if (servicesObject[i][0].credentials.users) { //user field may or maynot exist, depends on if there is membership services or not for the network
					console.log('overwritting users, loading from a vcap service: ', i);
					users = servicesObject[i][0].credentials.users;
				} else users = null;
				break;
			}
		}
	}
}

var options = {
	network: {
		peers: peers,
		users: users,
		options: {
			quiet: true,
			tls: true,
			maxRetry: 1
		}
	},
	chaincode: {
		zip_url: 'https://github.com/tyasu/mytest/archive/master.zip',
		unzip_dir:'mytest-master',
		git_url: 'https://github.com/tyasu/mytest',
	}
};
if (process.env.VCAP_SERVICES) {
	options.chaincode.deployed_name = '';
}

// Step 2 ==================================
ibc.load(options, cb_ready);

// Step 3 ==================================
function cb_ready(err, cc) { //response has chaincode functions
	if (err != null) {
		console.log('! looks like an error loading the chaincode or network, app will fail\n', err);
		if (!process.error) process.error = {
			type: 'load',
			msg: err.details
		};
	} else {
		chaincode = cc;
		console.log(cc.invoke);
		console.log(cc.details);
		bchain.setup(ibc, cc);
	}

	// Step 4 ==================================
	if (cc.details.deployed_name === "") { //decide if I need to deploy or not
		cc.deploy('init', ['99'], null, cb_deployed);
	} else {
		console.log('chaincode summary file indicates chaincode has been previously deployed');
		cb_deployed();
	}
}


//loop here, check if chaincode is up and running or not
function check_if_deployed(e, attempt) {
	if (e) {
		cb_deployed(e); //looks like an error pass it along
	} else if (attempt >= 15) { //tried many times, lets give up and pass an err msg
		console.log('[preflight check]', attempt, ': failed too many times, giving up');
		var msg = 'chaincode is taking an unusually long time to start. this sounds like a network error, check peer logs';
		if (!process.error) process.error = {
			type: 'deploy',
			msg: msg
		};
		cb_deployed(msg);
	} else {
		console.log('[preflight check]', attempt, ': testing if chaincode is ready');
		chaincode.query.read(['data'], function(err, resp) {
			var cc_deployed = false;
			try {
				if (err == null) { //no errors is good, but can't trust that alone
					if (resp === 'null') cc_deployed = true; //looks alright, brand new, no marbles yet
					else {
						var json = JSON.parse(resp);
						if (json.constructor === Array) cc_deployed = true; //looks alright, we have marbles
					}
				}
			} catch (e) {} //anything nasty goes here

			// ---- Are We Ready? ---- //
			if (!cc_deployed) {
				console.log('[preflight check]', attempt, ': failed, trying again');
				setTimeout(function() {
					check_if_deployed(null, ++attempt); //no, try again later
				}, 10000);
			} else {
				console.log('[preflight check]', attempt, ': success');
				cb_deployed(null); //yes, lets go!
			}
		});
	}
}



// Step 5 ==================================
function cb_deployed(err) {
	if (err != null) {
		console.log('deploy error!\n', err);
		if (!process.error) process.error = {
			type: 'deploy',
			msg: err.details
		};
	}else{
		console.log('------------------------------------------ Websocket Up ------------------------------------------');
		console.log(server);
		wss = new ws.Server({server: server});												//start the websocket now
		wss.on('connection', function connection(ws) {
			ws.on('message', function incoming(message) {
				console.log('received ws msg:', message);
				try{
					var data = JSON.parse(message);
					console.log(data);
					bchain.process_msg(ws, data);											//pass the websocket msg to part 1 processing
				}
				catch(e){
					console.log('ws message error', e);
				}
			});

			ws.on('error', function(e){console.log('ws error', e);});
			ws.on('close', function(){console.log('ws closed');});
		});

		wss.broadcast = function broadcast(data) {											//send to all connections
			wss.clients.forEach(function each(client) {
				try{
					client.send(JSON.stringify(data));
				}
				catch(e){
					console.log('error broadcast ws', e);
				}
			});
		};
}
}

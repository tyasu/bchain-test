var app = require('../../app');

exports.getHost = function(req, res) {
	var info=[];
	
	info={
		"host":app.appHost,
		"port":app.appPort
	};
	
	res.json(info);
};
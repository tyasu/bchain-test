module.exports = function(app) {

	//Todo:impliment blockchain interface.
	var ctrl = require('../app/controllers/controller.js');
	
	app.get('/info',ctrl.getHost);
	
};

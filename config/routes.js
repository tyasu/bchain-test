module.exports = function(app) {

	var ctrl = require('../app/controllers/controller.js');
	
	app.get('/info',ctrl.getHost);
	
};

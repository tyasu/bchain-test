var app = angular.module('tableApp', []);

// inject the Todo service factory into our controller
// base controller
app.controller('tableController', ['$scope', '$http', 'dataService', function($scope, $http, dataService) {
	$scope.requestUrl = '';
	var dServ = dataService();
	// GET =====================================================================
	$scope.getData = function(url) {
		dServ.getData(url).then(function() {
			$scope.data = dServ.data();
		});

	};

	$scope.postData = function(url, info) {
		dServ.postData(url, info).then(function() {
			$scope.pData = [];
		});
	};

}]);

app.controller('loginCtrl', ['$scope', '$controller', 'socket', function($scope, $controller, socket) {
	$controller('tableController', {
		$scope: $scope
	});

	var dt = new Date();

	$scope.getNendo = function(dat) {
		var y = dat.getFullYear();
		var m = dat.getMonth();
		//int to string
		if ((m >= 4) && (m <= 12)) return y.toString(10);
		else return (y - 1).toString(10);
	};

	$scope.issue = function() {
		$scope.issueData = {
			"type": "issue",
			"thing": $scope.itemName,
			"madeBy": $scope.itemMaker,
			"amount": $scope.itemNum,
			"createdAt": $scope.getNendo(dt),
		};
		socket.send($scope.issueData);
	};


}]);

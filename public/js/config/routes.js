var app= angular.module('appRoute', [ 'ngRoute' ]);
  app.config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/register.view.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

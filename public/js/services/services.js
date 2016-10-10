var app = angular.module( 'tableService', [] );

app.factory( 'dataService', [ '$http', '$q', function( $http, $q ) {
  //constructor
  var dServ = function() {
    var deffered = $q.defer();
    var content = {};

    //GET
    this.getData = function( url ) {
      $http.get( url, {
        headers: {
          'Content-type': 'application/json'
        }
      } )

      .success( function( ret ) {
          content = ret;
          deffered.resolve();
        } )
        .error( function() {
          deffered.reject();
        } );
      return deffered.promise;
    };


    this.postData = function( url, info ) {
			console.log(info);
      $http.post( url, {
          headers: {
            'Content-type': 'application/json'
          },
          data: info
        })
        .success( function( ret ) {
          deffered.resolve();
        } )
        .error( function() {
          deffered.reject();
        } );
      return deffered.promise;
    };

    this.data = function() {
      return content;
    };
  };

  //all Angular services are application singletons
  return function() {
    return new dServ();
  };

} ] );

//websocket
app.factory('socket', [function() {
    var stack = [];
    var onmessageDefer;
    var socket = {

        ws: new WebSocket('wss://' + document.location.hostname + ':' + document.location.port),
        send: function(data) {
            data = JSON.stringify(data);
            if (socket.ws.readyState == 1) {
                socket.ws.send(data);
            } else {
                stack.push(data);
            }
        },
        onmessage: function(callback) {
            if (socket.ws.readyState == 1) {
                socket.ws.onmessage = callback;
            } else {
                onmessageDefer = callback;
            }
        }
    };
    socket.ws.onopen = function(event) {
        for (i in stack) {
            socket.ws.send(stack[i]);
        }
        stack = [];
        if (onmessageDefer) {
            socket.ws.onmessage = onmessageDefer;
            onmessageDefer = null;
        }
    };

      return socket;
  }]);

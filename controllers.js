   var app=angular.module("myApp", []);

   var socket = io();
   app.controller("myCtrl", ['$scope','$location', function($scope, $location) {
    //$scope.aaaa = myService.get();
    $scope.messages = [];
     //$scope.aaaa=$location;
    $scope.submit=function(){
      socket.emit('chat message', angular.copy($scope.exampleText));
      $scope.exampleText='';
      return false; 
    }
    socket.on('chat message', function(msg){
      $scope.$apply(function() {
        $scope.messages.push(msg);
      });
    });
  }]);
var app=angular.module("myApp", []);

app.factory('myService', function() {
 var savedData = {}
 function set(data) {
   savedData = data;
 } 
 function get() {
  return savedData;
}

return {
  set: set,
  get: get
}

});

app.controller("myCtrl", ['$scope','$location', function($scope, $location) {
 
    $scope.messages = [];
     var socket = io();
 
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
 
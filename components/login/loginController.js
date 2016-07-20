 
var mymodule = angular.module('mymodule', ['ngRoute']);
mymodule.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl : 'pages/enter.html',
    controller  : 'SharedController'
  }) 
  .when('/chat', {
    templateUrl : 'pages/chat.html',
    controller  : 'cntrlChat'
  });
});


mymodule.factory('myService', function() {
 var savedData = {}
 var set=function (data) {
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

mymodule.controller('SharedController', ['$scope', 'myService','$location',
  function($scope, myService, $location){ 

    $scope.updateMsg = function (data) {
      myService.set(data);
      $location.path("chat");
    }

    $scope.getMsg = function () {
      $scope.message = myService.get();
    }

  }]);

mymodule.controller("cntrlChat", ['$scope', 'myService','$q','$timeout',
  function($scope, myService,$q,$timeout){ 
   var socket = io();
   $scope.messages = [];
   $scope.message_type="sender";
   $scope.room= myService.get().room;
   $scope.name= myService.get().name;
   socket.emit('room', $scope.room);

   $scope.submit=function(){
    socket.emit('chat_message',{ room: $scope.room, msg: $scope.name+": "+$scope.insertedText });
    $scope.message_type="sender";

    message={
      txt: $scope.name+": "+$scope.insertedText,
      sender: false
    }
    $scope.messages.push(message);
    $scope.insertedText='';
    return false; 
  }

  socket.on('chat_message', function(msg){
    $scope.$apply(function() {

      message={
        txt: msg,
        sender: true
      }
      
      $scope.messages.push(message);

    });
  });

  socket.on('info_message', function(msg){
    $scope.$apply(function() {
      $scope.info=msg;
    });
  });


  $scope.isUserTyping= function() {
   var runTwoFunctionWithSleepBetweenThem=function(foo1, foo2, time) {
     $q.when(foo1()).then(function() {
       $timeout(foo2, time);
     });
   }
   runTwoFunctionWithSleepBetweenThem(function (){socket.emit('info_message', { room: $scope.room, msg: $scope.name+' is typing...' })},
    function (){socket.emit('info_message', { room: $scope.room, msg: '' });},1500); 
 }
}]);


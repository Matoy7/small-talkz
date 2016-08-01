
smallTalkzModel.controller("chatController", ['$scope', 'sessionInfo','$q','$timeout','$http',
  function($scope, sessionInfo,$q,$timeout,$http){ 
   var socket = io();
   $scope.messages = [];
   $scope.message_type="sender";
   $scope.room= sessionInfo.get().room;
   $scope.name= sessionInfo.get().name;
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

    socket.on('disconnect', function(msg){
 
       $scope.messages.push('xxxxxxxxxxx');

  });

  socket.on('info_message', function(msg){
    $scope.$apply(function() {
      $scope.info=msg;
    });
  });


  $scope.isUserTyping= function() {
   var runTwoFunction=function(foo1, foo2, time) {
     $q.when(foo1()).then(function() {
       $timeout(foo2, time);
     });
   }
   runTwoFunction(function (){socket.emit('info_message', { room: $scope.room, msg: $scope.name+' is typing...' })},
    function (){socket.emit('info_message', { room: $scope.room, msg: '' });},1500); 
 }
}]);

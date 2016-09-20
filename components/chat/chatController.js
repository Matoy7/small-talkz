
smallTalkzModel.controller("chatController", ['$scope', 'sessionInfo','$q','$timeout','$http',
  function($scope, sessionInfo,$q,$timeout,$http){ 
   var socket = io();
   $scope.messages = [];
   $scope.users_list = [];
   $scope.message_type="sender";
   $scope.room= sessionInfo.get().room;
   $scope.name= sessionInfo.get().name;

   socket.emit('room', $scope.room);
   socket.emit('user', $scope.name);

   var room_info;

   var updateUsersList =function (){
    $scope.users_list=[];
    $http.get('/online_users')
    .success(function(data) {

      data.forEach(updateUsers);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    })
  };

  function updateUsers(element, index, array) {
     console.log('element---->'+element);
     console.log('index---->'+index);
     console.log('array---->'+array);
    $scope.users_list.push(element.user_name);
  }

  updateUsersList();

  socket.emit('chat_message',{ room: $scope.room, msg: $scope.name+' has joined the coversation' });

  socket.emit('new_user',{room: $scope.room, name: $scope.name});

  $scope.submit=function(){
    socket.emit('chat_message',{ room: $scope.room, msg: $scope.name+": "+$scope.insertedText });

    message={
      txt: $scope.name+": "+$scope.insertedText,
      sender: true
    }
    $scope.messages.push(message);
    $scope.insertedText='';
    return false; 
  }

  socket.on('handle_new_user', function(data){
    $scope.$apply(function() {
     updateUsersList();
   });
  });

  socket.on('chat_message', function(msg){
    $scope.$apply(function() {

      message={
        txt: msg,
        sender: false
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
   var runTwoFunction=function(foo1, foo2, time) {
     $q.when(foo1()).then(function() {
       $timeout(foo2, time);
     });
   }
   runTwoFunction(function (){socket.emit('info_message', { room: $scope.room, msg: $scope.name+' is typing...' })},
    function (){socket.emit('info_message', { room: $scope.room, msg: '' });},1500); 
 }
}]);


 

var smallTalkzModel = angular.module('smallTalkzModel', ['ngRoute']);
smallTalkzModel.config(function($routeProvider) {

  $routeProvider
  .when('/', {
    templateUrl : 'components/login/loginView.html',
    controller  : 'loginController'
  }) 
  .when('/chat', {
    templateUrl : 'components/chat/chatView.html',
    controller  : 'chatController'
  });
});;


smallTalkzModel.factory('sessionInfo', function() {
 var savedInfo = {}
 var set=function (info) {
   savedInfo = info;
 } 
 function get() {
  return savedInfo;
}

return {
  set: set,
  get: get
}

});



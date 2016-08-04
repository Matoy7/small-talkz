 

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
  }).run(function ($rootScope) {

    // App is loading, so set isAppLoading to true and start a timer
    console.log($rootScope);
    $rootScope.isAppLoading = true;

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



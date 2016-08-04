 

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

    $rootScope.$on('$stateChangeSuccess', function() {
       $('body').removeClass('loader');
    });

    $rootScope.$on('$stateChangeStart', function() {
       $('body').addClass('loader');
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



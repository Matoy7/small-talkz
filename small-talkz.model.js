 

var smallTalkzModel = angular.module('smallTalkzModel', ['ui.router','luegg.directives']);
smallTalkzModel.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl : 'components/login/loginView.html',
		controller  : 'loginController'
	}) 
	.state('chat', {
		url: '/chat',
		templateUrl : 'components/chat/chatView.html',
		controller  : 'chatController'
	})
	.state('signup', {
		url: '/signup',
		templateUrl : 'components/signup/signupView.html',
		controller  : 'signupController'
	})
	$urlRouterProvider.otherwise('/login');

});


smallTalkzModel.factory('userDetails', [function() {
	return {
		isLogged: false,
		username: ''
	};
}]);

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



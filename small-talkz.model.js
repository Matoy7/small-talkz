 

var smallTalkzModel = angular.module('smallTalkzModel', ['ui.router','luegg.directives','ngCookies']);
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
	.state('main', {
		url: '/main',
		templateUrl : 'components/main/mainView.html',
		controller  : 'mainController'
	})
	.state('signup', {
		url: '/signup',
		templateUrl : 'components/signup/signupView.html',
		controller  : 'signupController'
	})
	$urlRouterProvider.otherwise('/login');

});


smallTalkzModel.factory('userDetails', ["$cookies",
	function($cookies) {
		return {
			isLogged: ($cookies.get('token')!=undefined),
			username: $cookies.get('token')
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

smallTalkzModel.factory('authInterceptor',["$q","$cookies", 
	function ($q,$cookies) {
		return {
			request: function (config) {

				config.headers = config.headers || {};
				if ($cookies.get('token')) {
					config.headers.Authorization = 'Bearer ' + $cookies.get('token');
				}
				return config;
			},
			responseError: function (rejection) {
				if (rejection.status === 401) {
        // handle the case where the user is not authenticated
    }
    return $q.reject(rejection);
}
};
}]);

smallTalkzModel.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
});

//this is used to parse the profile
function url_base64_decode(str) {
	var output = str.replace('-', '+').replace('_', '/');
	switch (output.length % 4) {
		case 0:
		break;
		case 2:
		output += '==';
		break;
		case 3:
		output += '=';
		break;
		default:
		throw 'Illegal base64url string!';
	}
	return window.atob(output); 
}





var smallTalkzModel = angular.module('smallTalkzModel', [
	'smallTalkzModel.login','smallTalkzModel.main','smallTalkzModel.signup','smallTalkzModel.chat'
])
	.config(function ($stateProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'components/login/loginView.html',
				controller: 'loginController'
			})
			.state('chat', {
				url: '/chat',
				templateUrl: 'components/chat/chatView.html',
				controller: 'chatController'
			})
			.state('main', {
				url: '/main',
				templateUrl: 'components/main/mainView.html',
				controller: 'mainController',
				data: {
					requiresLogin: true
				}
			})
			.state('signup', {
				url: '/signup',
				templateUrl: 'components/signup/signupView.html',
				controller: 'signupController'
			})
		$urlRouterProvider.otherwise('/main');

		jwtInterceptorProvider.tokenGetter = function ($localStorage) {
 			return $localStorage.jwt;
		}

		

		$httpProvider.interceptors.push('jwtInterceptor');

	})
	.run(function ($rootScope, $state, $localStorage, jwtHelper) {

		$rootScope.$on('$stateChangeStart', function (e, to) {
			if (to.data && to.data.requiresLogin) {
				if (!$localStorage.jwt || jwtHelper.isTokenExpired($localStorage.jwt)) {
					e.preventDefault();
					$state.go('login');
				}
			}
		});
	})

smallTalkzModel.factory('userDetails', function () {
	var savedInfo = {}
	var set = function (info) {
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

smallTalkzModel.factory('sessionInfo', function () {
	var savedInfo = {}
	var set = function (info) {
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



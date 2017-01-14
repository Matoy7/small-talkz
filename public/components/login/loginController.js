

angular.module('smallTalkzModel.login', [
	'ngStorage',
	'ui.router',
	'luegg.directives',
	'ngCookies',
	'ngStorage',
	'angular-jwt'
]).controller('loginController', ['$scope', '$location', '$http', '$cookies', '$localStorage', 'httpService', 'userDetails', 'sessionInfo',
	function ($scope, $location, $http, $cookies, $localStorage, httpService, userDetails, sessionInfo) {
		$scope.login_info = "";
		$scope.userLogin = userDetails.isLogged;
		$scope.getUserByMail = httpService.get_user_by_mail;
		$scope.userLogin = function (user_credentials) {
			return httpService.get_user_login(user_credentials).then(function (response) {
				httpService.add_online_user({ "user_mail": user_credentials.Mail });
				$localStorage.jwt = response.data.id_token;
				$location.path('main');
			}, function (error) {
				$scope.login_info = "worng name or password";
			});
		}
		httpService.get_online_users()
			.success(function (data) {
				$scope.usersNumber = data.length;

			})
			.error(function (data) {
				console.log('Error: ' + data);
			});
		;
		httpService.get_online_rooms()
			.success(function (data) {
				$scope.roomsNumber = data.length;

			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

	}]);
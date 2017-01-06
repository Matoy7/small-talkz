

angular.module('smallTalkzModel.login', [
	'ngStorage',
	'ui.router',
	'luegg.directives',
	'ngCookies',
	'ngStorage',
	'angular-jwt'
]).controller('loginController', ['$scope', 'sessionInfo', '$location', '$http', 'userDetails', '$cookies', '$localStorage',
	function ($scope, sessionInfo, $location, $http, userDetails, $cookies, $localStorage) {
 
		$scope.login_info = "";
		$scope.userLogin = userDetails.isLogged;
		$http.get('/online_users')
			.success(function (data) {
				$scope.usersNumber = data.length;

			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		$http.get('/online_rooms')
			.success(function (data) {
				$scope.roomsNumber = data.length;

			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		$scope.getUserByMail = function (info) {
			return $http.post('/getUserByMail', info);
		}

 
		$scope.userLogin = function (info) {
			
			$http({
				url: '/authenticate_user',
				method: 'POST',
				data: info
			}).then(function (response) {
				add_online_user({ "user_mail": info.Mail });
				$localStorage.jwt = response.data.id_token;
				$location.path('main');
			}, function (error) {
				$scope.login_info = "worng name or password";
			});
		}

		var add_online_user = function (info) {
			$http({
				url: '/add_online_user',
				method: 'POST',
				data: info
			}).then(function (response) {

			}, function (error) {

			});
		}


		$scope.getMsg = function () {
			$scope.message = sessionInfo.get();
		}

	}]);
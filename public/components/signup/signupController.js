
angular.module('smallTalkzModel.signup', [
	'ngStorage',
	'ui.router',
	'luegg.directives',
	'ngCookies',
	'ngStorage',
	'angular-jwt'
]).controller('signupController', ['$scope', '$location', '$http', 'userDetails', '$localStorage',
	function ($scope, $location, $http, userDetails, $localStorage) {

		$scope.login_info = "";
		$scope.userDetails = userDetails.isLogged;
		$scope.userLogin = false;
		$http.get('/online_users')
			.success(function (data) {
				$scope.usersNumber = data.length;
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		var is_mail_already_exists = function (info) {

			return $http({
				url: '/is_mail_already_exists',
				method: 'POST',
				data: info
			});

		}

		var register_user = function (info) {
			$http({
				url: '/register_user',
				method: 'POST',
				data: info
			}).then(function (response) {
				$localStorage.jwt = response.data.id_token;
				$location.path('main');
			}, function (error) {
				alert(error.data);
			});
		}

		$scope.register_user_if_not_exists = function (info) {
			is_mail_already_exists(info).then(function (response) {
			 console.log(response);
				if (response.data.is_mail_exists) {
					$scope.sign_up_info = "user with such mail already exists.";
				}
				else {
					register_user(info);
				}
			}, function (error) {
				alert(error.data);
			});

		}


	}]);
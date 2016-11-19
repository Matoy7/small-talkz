
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

		$scope.register_user = function (info) {
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

	}]);
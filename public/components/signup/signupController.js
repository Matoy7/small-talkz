
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
		get_online_users();
		get_online_rooms();


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
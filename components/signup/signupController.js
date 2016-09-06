

smallTalkzModel.controller('signupController', ['$scope', 'sessionInfo','$location','$http', 'userDetails',
	function($scope, sessionInfo, $location, $http, userDetails){ 
		
		$scope.login_info="";
		$scope.userDetails=userDetails.isLogged;
		$scope.userLogin=false;
		$http.get('/online_users')
		.success(function(data) {
			$scope.usersNumber = data.length;

		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

		$scope.register_user = function (info) {
	 
			return $http.post('/register_user', info);
		}

		$scope.NewConversation=false;
		



	}]);
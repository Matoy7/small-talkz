

smallTalkzModel.controller('loginController', ['$scope', 'sessionInfo','$location','$http', 'userDetails',
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

		$scope.NewConversation=false;
		

		$scope.getRandomRoom = function () {
			$http.get('/rooms')
			.success(function(data) {
				$scope.randomName = "guest";
				$scope.randomRoom = data.room_name;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		}
 
		$scope.enterRoom = function (info) {
			sessionInfo.set(info);			
			
			$scope.name=sessionInfo.get().FirstName;
			$scope.room=sessionInfo.get().room;

			$http.post('/online_users', {'user_name':$scope.name,'room_name':$scope.room})
			.success(function(data) {
			})
			.error(function(data) {
				console.log('Error:'+ data);
			});

			$location.path("chat");
		}

		$scope.userLogin = function (info) {
			$scope.FirstName=info.name;
			$scope.FirstName=info.name;
			return $http.post('/authenticate_user', info);
		}

		$scope.validate_user=function(res) {
			console.log(res.data);
			if (res.data==true){

				$scope.isUserLogin=true;
			}
			else{
				$scope.login_info="Wrong mail or password";
			}
		}




		$scope.getMsg = function () {
			$scope.message = sessionInfo.get();
		}


	}]);
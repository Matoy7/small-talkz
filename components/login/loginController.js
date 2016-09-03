

smallTalkzModel.controller('loginController', ['$scope', 'sessionInfo','$location','$http', 'userDetails',
	function($scope, sessionInfo, $location, $http, userDetails){ 
		
		$scope.login_info="";
		$scope.userDetails=userDetails.isLogged;
		$scope.userLogin=false;
		$http.get('/users')
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
			
			$scope.name=sessionInfo.get().name;
			$scope.room=sessionInfo.get().room;

			$http.get('/users', {'user_name':$scope.name,'room_name':$scope.room})
			.success(function(data) {
			})
			.error(function(data) {
				console.log('Error:'+ data);
			});

			$location.path("chat");
		}

		$scope.userLogin = function (info) {
			$scope.name=info.name;
			return $http.post('/authenticate_user', info);
		}

		$scope.validate_user=function(res) {
			console.log(res.data);
			if (res.data==true){

				$scope.isUserLogin=true;
			}
			else{
				$scope.login_info="Wrong user or password";
			}
		}




		$scope.getMsg = function () {
			$scope.message = sessionInfo.get();
		}


	}]);
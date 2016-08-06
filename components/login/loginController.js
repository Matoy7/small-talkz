


smallTalkzModel.controller('loginController', ['$scope', 'sessionInfo','$location','$http',
	function($scope, sessionInfo, $location, $http){ 
		
		
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

			$http.post('/users', {'user_name':$scope.name,'room_name':$scope.room})
			.success(function(data) {
			})
			.error(function(data) {
				console.log('Error:'+ data);
			});

			$location.path("chat");
		}

		$scope.getMsg = function () {
			$scope.message = sessionInfo.get();
		}


	}]);
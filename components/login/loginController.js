

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

		var socket = io();

		$scope.userLogin = function (info) {
			$scope.Mail=info.Mail;
			socket.emit('authenticate_user',info);
			return $http.post('/authenticate_user', info);
		}

		socket.on('login_succeeded', function(data){
			console.log('true!!');
		});

		socket.on('login_failed', function(data){
			console.log('false.......');
		});

		$scope.getUserByMail = function (info) {
			return $http.post('/getUserByMail', info);
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
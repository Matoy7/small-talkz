

smallTalkzModel.controller('mainController', ['$scope', 'sessionInfo', '$location', '$http', 'userDetails', 'jwtHelper', '$localStorage',
	function ($scope, sessionInfo, $location, $http, userDetails, jwtHelper, $localStorage) {


		$http.get('/decodeToken')
			.success(function (data) {
				loadUserDetails(data);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});
			
		var loadUserDetails = function (data) {
			$scope.userMail = data.Mail;
		}
		$scope.login_info = "";
		$scope.userLogin = userDetails.isLogged;

		var jwt = $localStorage.jwt;
		var decodedJwt = jwt && jwtHelper.decodeToken(jwt);


		$http.get('/online_users')
			.success(function (data) {
				$scope.usersNumber = data.length;

			})
			.error(function (data) {
				console.log('Error: ' + data);
			});

		$scope.NewConversation = false;





		$scope.getRandomRoom = function () {
			$http.get('/rooms')
				.success(function (data) {
					$scope.randomName = "guest";
					$scope.randomRoom = data.room_name;
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});

		}

		$scope.enterRoom = function (info) {


			sessionInfo.set(info);

			$scope.name = sessionInfo.get().name;
			$scope.room = sessionInfo.get().room;


			$http.post('/online_users', { 'user_name': $scope.name, 'room_name': $scope.room })
				.success(function (data) {
				})
				.error(function (data) {
					console.log('Error:' + data);
				});

			$location.path("chat");
		}

		var socket = io();

		$scope.userLogin = function (info) {
			$scope.Mail = info.Mail;
			return $http.post('/authenticate_user', info);
		}
		$scope.logoff = function () {
			$localStorage.$reset();
			$location.path('login');
		}

		socket.on('login_succeeded', function (data) {
			console.log('login had ssucceeded');
		});

		socket.on('login_failed', function (data) {
			console.log('login had failed');
		});

		$scope.getUserByMail = function (info) {
			return $http.post('/getUserByMail', info);
		}

		$scope.validate_user = function (res) {

			if (res.data == true) {

				$scope.isUserLogin = true;
			}
			else {
				$scope.login_info = "Wrong mail or password";
			}
		}




		$scope.getMsg = function () {
			$scope.message = sessionInfo.get();
		}


	}]);
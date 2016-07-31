


smallTalkzModel.controller('loginController', ['$scope', 'sessionInfo','$location','$http',
	function($scope, sessionInfo, $location, $http){ 
		    // when landing on the page, get all todos and show them
		    $http.get('/users')
		    .success(function(data) {
		    	$scope.count = data.length;

		    })
		    .error(function(data) {
		    	console.log('Error: ' + data);
		    });


		    $scope.updateMsg = function (info) {
		    	sessionInfo.set(info);
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
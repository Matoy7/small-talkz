smallTalkzModel.controller('loginController', ['$scope', 'sessionInfo','$location',
	function($scope, sessionInfo, $location){ 

		$scope.updateMsg = function (info) {
			sessionInfo.set(info);
			$location.path("chat");
		}

		$scope.getMsg = function () {
			$scope.message = sessionInfo.get();
		}

	}]);
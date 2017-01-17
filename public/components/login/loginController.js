

angular.module('smallTalkzModel.login', [
    'ngStorage',
    'ui.router',
    'luegg.directives',
    'ngCookies',
    'ngStorage',
    'angular-jwt'
]).controller('loginController', ['$scope', '$location', '$http', '$cookies', '$localStorage', 'httpService', 'userDetails',
    function ($scope, $location, $http, $cookies, $localStorage, httpService, userDetails) {
        $scope.login_info = "";
        $scope.userLogin = userDetails.isLogged;
        $scope.getUserByMail = httpService.get_user_by_mail;

        $scope.userLogin = function (user_credentials) {
            var response;
            httpService.get_user_login(user_credentials)
                .then(function (_response) {
                    response=_response;
                    httpService.add_online_user({ "user_mail": user_credentials.Mail })
                }, function (error) {
                    $scope.login_info = "wrong name or password";
                }).then(function () {
                $localStorage.jwt = response.data.id_token;
                $location.path('main');
            });
        }
        httpService.get_online_users()
            .success(function (data) {
                $scope.usersNumber = data.length;

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        ;
        httpService.get_online_rooms()
            .success(function (data) {
                $scope.roomsNumber = data.length;

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    }]);
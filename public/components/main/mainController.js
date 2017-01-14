
angular.module('smallTalkzModel.main', [
    'ngStorage',
    'ui.router',
    'luegg.directives',
    'ngCookies',
    'ngStorage',
    'angular-jwt'
]).controller('mainController', ['$scope', 'sessionInfo', '$location', '$http', 'httpService', 'userDetails', 'jwtHelper', '$localStorage', '$q',
    function ($scope, sessionInfo, $location, $http, httpService, userDetails, jwtHelper, $localStorage, $q) {
      
      
      var loadUserDetails = function (data) {
            $scope.userMail = data.Mail;
        }

        httpService.decode_token(loadUserDetails);
  
  
        $scope.login_info = "";
        $scope.userLogin = userDetails.isLogged;

        var jwt = $localStorage.jwt;
        var decodedJwt = jwt && jwtHelper.decodeToken(jwt);

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

        $scope.NewConversation = false;
        $scope.getRandomRoom =  httpService.getRandomRoom;

        var create_room_if_not_exists = function (room_name) {
            return httpService.is_room_already_exists({
                'name': room_name
            }).then(function (response) {
                if (!response.data.is_room_exists) {
                    return httpService.register_room({
                        'name': room_name
                    });
                } else {
                    return room_name;
                };
            }, function (error) {
                throw error;
            });

        }

        var add_user_to_room = function (user_name, room_name) {
            return httpService.add_user_to_room_request({
                'user_name': user_name,
                'room_name': room_name
            });
        }

        $scope.enterRoom = function (info) {
            create_room_if_not_exists(info.room).then(function () {
                add_user_to_room(info.name, info.room);
            }).then(function () {
                $scope.room = sessionInfo.set({ "room": info.room, "userMail": info.name });

                $location.path("chat")
            })
        }


        var socket = io();

        $scope.userLogin =  httpService.userlogin;



        $scope.logoff = function () {
            $q.when(httpService.remove_online_user({ "user_mail": $scope.userMail })).then(function () {
                $localStorage.$reset();
                $location.path('login');

            });

        }


        $scope.getUserByMail =  httpService.getUserByMail;


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


smallTalkzModel.controller('mainController', ['$scope', 'sessionInfo', '$location', '$http', 'userDetails', 'jwtHelper', '$localStorage', '$q',
    function ($scope, sessionInfo, $location, $http, userDetails, jwtHelper, $localStorage, $q) {


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


        $http.get('/online_rooms')
            .success(function (data) {
                $scope.roomsNumber = data.length;

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        $scope.NewConversation = false;


        $scope.getRandomRoom = function () {

            $http.get('/get_random_room')
                .success(function (data) {

                    $scope.randomRoom = data.room_name;

                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });

        }



        var remove_online_user = function (info) {

            $http({
                url: '/remove_online_user',
                method: 'POST',
                data: info
            });
            return;
        }

        var register_room = function (info) {
                                    

            return $http({
                url: '/register_room',
                method: 'POST',
                data: info
            });
        }

        var add_user_to_room_request = function (info) {
                                               

            return $http({
                url: '/add_user_to_room',
                method: 'POST',
                data: info
            });
        }

        var is_room_already_exists = function (info) {
                                                        

            return $http({
                url: '/is_room_already_exists',
                method: 'POST',
                data: info
            });
        }



        var create_room_if_not_exists = function (room_name) {
                   

            return is_room_already_exists({
                'name': room_name
            }).then(function (response) {
                if (!response.data.is_room_exists) {
                    return register_room({
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
            return add_user_to_room_request({
                'user_name': user_name,
                'room_name': room_name
            });
        }

        $scope.enterRoom = function (info) {
              create_room_if_not_exists($scope.room).then(function () {
                  add_user_to_room($scope.userMail, $scope.roomName);
                            console.log("room===>"+$scope.roomName);

            }).then(function () {
                $location.path("chat")
            })
        }

 
        var socket = io();

        $scope.userLogin = function (info) {
            $scope.Mail = info.Mail;
            return $http.post('/authenticate_user', info);
        }



        $scope.logoff = function () {
            $q.when(remove_online_user({ "user_mail": $scope.userMail })).then(function () {
                $localStorage.$reset();
                $location.path('login');

            });

        }


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
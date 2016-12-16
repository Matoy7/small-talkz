

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

                    $scope.randomRoom = data.name;
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });

        }

        var is_room_already_exists = function (info) {
            return $http({
                url: '/is_room_already_exists',
                method: 'POST',
                data: info
            });
        }

        var register_room = function (info) {
            $http({
                url: '/register_room',
                method: 'POST',
                data: info
            });
        }

        $scope.enterRoom = function (info) {

            sessionInfo.set(info);
            $scope.name = sessionInfo.get().name;
            $scope.room = sessionInfo.get().room;

            $http.post('/add_new_user_session', { 'user_name': $scope.name, 'room_name': $scope.room })
                .success(function (data) {
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });

            is_room_already_exists({'name': $scope.room}).then(function (response) {

                if (!response.data.is_room_exists) {
                    register_room({'name': $scope.room});
                }
            }, function (error) {
                alert(error.data);
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
            console.log('login succeeded');
        });

        socket.on('login_failed', function (data) {
            console.log('login failed');
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
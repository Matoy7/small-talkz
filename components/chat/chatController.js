
smallTalkzModel.controller("chatController", ['$scope', 'sessionInfo', '$q', '$timeout', '$http',
    function ($scope, sessionInfo, $q, $timeout, $http) {
        var socket = io();
        $scope.messages = [];
        $scope.users_list = [];
        $scope.message_type = "sender";
        $scope.room = sessionInfo.get().room;
        $scope.userMail = sessionInfo.get().userMail;

        socket.emit('room', $scope.room);
        socket.emit('user', $scope.name);

        var room_info;
        $scope.users_list = [];



        var updateUsersList = function (room_name) {

            $http({
                url: '/get_users_in_room',
                method: 'POST',
                data: { "room_name": room_name}
            }).then(function (response) {
                $scope.users_list=[];
                response.data.users_list.forEach(updateUsers);
            }, function (error) {
                console.log(error);
            });
        };

        function updateUsers(element, index, array) {
            $scope.users_list.push(element);
        }

        updateUsersList($scope.room);

        socket.emit('chat_message', { room: $scope.room, msg: $scope.userMail + ' has joined the coversation' });

        socket.emit('new_user', { room: $scope.room, name: $scope.userMail });

        $scope.submit = function () {
            socket.emit('chat_message', { room: $scope.room, msg: $scope.insertedText });

            message = {
                txt: $scope.insertedText,
                sender: true
            }
            $scope.messages.push(message);
            $scope.insertedText = '';
            return false;
        }

        socket.on('new_user', function (room) {
            $scope.$apply(function () {updateUsersList(room)})
        });

        socket.on('chat_message', function (msg) {
            $scope.$apply(function () {

                message = {
                    txt: msg,
                    sender: false
                }

                $scope.messages.push(message);

            });
        });



        socket.on('info_message', function (msg) {
            $scope.$apply(function () {
                $scope.info = msg;
            });
        });


        $scope.isUserTyping = function () {
            var runTwoFunction = function (foo1, foo2, time) {
                $q.when(foo1()).then(function () {
                    $timeout(foo2, time);
                });
            }
            runTwoFunction(function () { socket.emit('info_message', { room: $scope.room, msg: $scope.name + ' is typing...' }) },
                function () { socket.emit('info_message', { room: $scope.room, msg: '' }); }, 1500);
        }
    }]);


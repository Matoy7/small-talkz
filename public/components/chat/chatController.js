

angular.module('smallTalkzModel.chat', [
    'ngStorage',
    'ui.router',
    'luegg.directives',
    'ngCookies',
    'ngStorage',
    'angular-jwt'
]).controller("chatController", ['$scope', 'sessionInfo','httpService', '$q', '$timeout', '$http',
    function ($scope, sessionInfo, httpService, $q, $timeout, $http) {
        var socket = io();
        $scope.messages = [];
        $scope.users_list = [];
        $scope.message_type = "sender";
        $scope.room = sessionInfo.get().room;
        $scope.userMail = sessionInfo.get().userMail;

        socket.emit('room', $scope.room);
        socket.emit('user', $scope.userMail);

        var room_info;
        $scope.users_list = [];


        function updateUsers(element, index, array) {
            $scope.users_list.push(element);
        }

        httpService.update_users_list($scope.room)
            .then(function (response) {
                $scope.users_list = [];
                response.data.users_list.forEach(updateUsers);
            }, function (error) {
                console.log(error);
            })

        socket.emit('chat_message', { room: $scope.room, msg: $scope.userMail + ' has joined the room' });

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

        socket.on('update_users', function (room) {
            $scope.$apply(function () {httpService.update_users_list(room)})
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


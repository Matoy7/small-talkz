var smallTalkzModel = angular.module('smallTalkzModel');

smallTalkzModel.factory('httpService', ['$http', function ($http) {
    return {
        update_users_list: function (room_name) {
            return $http({
                url: '/get_users_in_room',
                method: 'POST',
                data: { "room_name": room_name }
            })

        },

        get_user_by_mail: function (info) {
            return $http.post('/getUserByMail', info);
        },

        get_online_users: function () {
           
            return $http({
                url: '/online_users',
                method: 'GET'
            })
        },

        get_online_rooms: function () {
            return $http({
                url: '/online_rooms',
                method: 'GET'
            })
        },

        get_user_login: function (info) {
            return $http({
                url: '/authenticate_user',
                method: 'POST',
                data: info
            })
        },

        add_online_user: function (info) {
            return $http({
                url: '/add_online_user',
                method: 'POST',
                data: info
            })
        },

        decode_token: function (loadUserDetails) {
            $http.get('/decodeToken')
                .success(function (data) {
                    loadUserDetails(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        },

        get_random_room: function () {
            return $http({
                url: '/get_random_room',
                method: 'GET',
            })
        },

        remove_online_user: function (info) {
            $http({
                url: '/remove_online_user',
                method: 'POST',
                data: info
            });
            return;
        },

        register_room: function (info) {
            return $http({
                url: '/register_room',
                method: 'POST',
                data: info
            });
        },

        add_user_to_room_request: function (info) {
            return $http({
                url: '/add_user_to_room',
                method: 'POST',
                data: info
            });
        },

        is_room_already_exists: function (info) {
            return $http({
                url: '/is_room_already_exists',
                method: 'POST',
                data: info
            });
        },

        get_user_by_mail: function (info) {
            return $http.post('/getUserByMail', info);
        },

        user_login: function (info) {
            $scope.Mail = info.Mail;
            return $http.post('/authenticate_user', info);
        },

        is_mail_already_exists: function (info) {

            return $http({
                url: '/is_mail_already_exists',
                method: 'POST',
                data: info
            });

        },

        register_user: function (info) {
            $http({
                url: '/register_user',
                method: 'POST',
                data: info
            }).then(function (response) {
                $localStorage.jwt = response.data.id_token;
                $location.path('main');
            }, function (error) {
                alert(error.data);
            });
        }

    }

}]);
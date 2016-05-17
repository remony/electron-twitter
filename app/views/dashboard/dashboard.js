'use strict';

angular.module('app.dashboard', ['ngRoute'])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/dashboard/dashboard.html',
                controller: 'dashboardCtrl'
            });
        }
    ])

.controller('dashboardCtrl', ['$scope', '$timeout',
    function($scope, $timeout) {
        var ipcRenderer = require('electron').ipcRenderer;
        $scope.title = 'welcome';
        $scope.userStream = [];


        //    Check if logged in
        if (window.localStorage.auth) {
            var auth = JSON.parse(window.localStorage.auth);
            ipcRenderer.send('auth', auth.token, auth.secret);
        } else {
            ipcRenderer.send('login', 'ping');
        }


        //Load cached tweets
        if (window.localStorage.tweets) {
            $timeout(function() {
                $scope.userStream = JSON.parse(window.localStorage.tweets)
            })

        } else {
            $timeout(function() {
                $scope.userStream = [];
            })
        }

        // Listen for logger
        ipcRenderer.on('logger', function(event, arg) {

        });

        //     Listen for tweets
        ipcRenderer.on('user-stream', function(event, arg) {
            $scope.$apply(function() {
                $scope.userStream.unshift(JSON.parse(arg))
            });

            // window.localStorage.tweets = JSON.stringify($scope.userStream)
        });

        $scope.$on('$destroy', function() {
            ipcRenderer.send('killuserstream')
        });



        $scope.showProfile = function(user) {
            console.log('click')
            console.log(user);
            $timeout(function() {
                user.random = Math.random();
                $scope.userModalData = user;

            })
        }

    }
]);
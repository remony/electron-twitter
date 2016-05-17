'use strict';

angular.module('app.component.editor', [])
    .directive('editor', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                data: '@'
            },
            templateUrl: 'components/editor/editor.html',
            link: function(scope, element, attrs) {
                var ipcRenderer = require('electron').ipcRenderer;
                var auth = JSON.parse(window.localStorage.auth);
            
                console.log('this is editor speaking')
                scope.tweet = function(tweet) {
                    console.log(tweet);
                    ipcRenderer.send('tweet', tweet);   
                    $timeout(function() {
                        scope.userTweet = '';
                    })



                    
                }


                var status = {
                    ctrl: false,
                    enter: false
                }

                function checkShortcut() {
                    console.log(status)
                    if (status.ctrl && status.enter) {
                        console.log('yay')
                        scope.tweet(scope.userTweet);

                    }
                }
                Mousetrap.bind('ctrl+enter', function(e) {
                    // console.log(scope.userTweet)
                    scope.tweet(scope.userTweet);
                });


            }
        };
    });
'use strict';

angular.module('app.component.timage', [])
    .directive('timage', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                data: '@'
            },
            templateUrl: 'components/timages/timages.html',
            link: function(scope, element, attrs) {
                console.log('this is timage speaking')


                scope.$watch('data', function(newVal) {
                    console.log('got new data')

                    $timeout(function() {
                        scope.images = JSON.parse(attrs.data)
                        console.log(scope.images)

                        // Detect image type

                        scope.images.forEach(function(image) {
                            console.log(image.type)
                            if (image.type === 'photo') {
                                scope.isImage = true;
                            } else if (image.type === 'animated_gif') {
                                scope.isVideo = true;
                            }
                            scope.title = 'hello'

                        })
                    })
                });


            }
        };
    })
    .filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);
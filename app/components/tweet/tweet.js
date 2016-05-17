'use strict';

angular.module('app.component.tweet', [])
.directive('tweet', function() {
    return {
        restrict: 'E',
        scope: { data: '@' },
        templateUrl: 'components/tweet/tweet.html',
        link: function(scope, element, attrs) {

            scope.tweet = JSON.parse(scope.data);
        }
    };
});
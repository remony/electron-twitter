'use strict';

angular.module('app.component.usermodal', [])
.directive('usermodal', function($timeout) {
    return {
        restrict: 'E',
        scope: { data: '@' },
        templateUrl: 'components/userModal/usermodal.html',
        link: function(scope, element, attrs) {
          scope.open = false;

          scope.$watch('data', function(newVal) {

            $timeout(function() {
              if (attrs.data) {
                scope.open = true;
                scope.user = JSON.parse(attrs.data);
                scope.user.profile_background_color = '#' + scope.user.profile_background_color;
              }
            })
          });

          scope.close = function() {
            scope.open = false;
          }
        }
    };
});

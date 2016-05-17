'use strict';

angular.module('app', [
    'ngRoute',
    'app.dashboard',
    'app.component.tweet',
    'app.component.usermodal',
    'app.component.timage',
    'app.component.editor'
]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/dashboard'
    })
}]);

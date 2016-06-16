'use strict';

var votingApp = angular.module('votingApp', [
    'ngRoute',
    'votingControllers',
    'votingServices'
]);

votingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/poll-detail', {
            templateUrl: 'public/partials/poll-detail.html',
            controller: 'pollDetailController'
        }).
        when('/polls', {
            templateUrl: 'public/partials/polls.html',
            controller: 'pollController'
        }).
        otherwise({
            redirectTo: '/polls'
        });
    }]);

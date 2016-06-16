'use strict';

var votingApp = angular.module('votingApp', [
    'ngRoute',
    'votingControllers',
    'votingServices'
]);

votingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/poll-detail/:pollId/', {
            templateUrl: 'public/partials/poll-detail.html',
            controller: 'pollDetailController'
        }).
        when('/polls', {
            templateUrl: 'public/partials/polls.html',
            controller: 'pollController'
        }).
        when('/my-polls', {
            templateUrl: 'public/partials/my-polls.html',
            controller: 'myPollsController'
        }).
        when('/new-poll', {
            templateUrl: 'public/partials/new-poll.html',
            controller: 'newPollController'
        }).
        otherwise({
            redirectTo: '/polls'
        });
    }]);

'use strict';


var votingControllers = angular.module('votingControllers', []);

votingControllers.controller('pollController', ['$scope', '$route', '$window','$location', 'votingService',
    function ($scope, $route, $window, $location, votingService) {

        var listPolls = function() {
            votingService.listPolls().then(function(data) {
                $scope.polls = data;
            });
        };

        $scope.goToDetails =  function(pollId) {
            $location.path('/poll-detail/' + pollId);
        };

        listPolls();

    }]);

votingControllers.controller('myPollsController', ['$scope', '$route', '$window','$location', 'votingService',
    function ($scope, $route, $window, $location, votingService) {



    }]);

votingControllers.controller('newPollController', ['$scope', '$route', '$window','$location', 'votingService',
    function ($scope, $route, $window, $location, votingService) {



    }]);

votingControllers.controller('pollDetailController', ['$scope', '$route', '$routeParams' ,'$window','$location', 'votingService',
    function ($scope, $route, $routeParams , $window, $location, votingService) {
        $scope.pollId=$routeParams.pollId;
    }]);

votingControllers.controller('barController', ['$scope', '$rootScope', '$route', '$routeParams' ,'$window','$location', 'votingService',
    function ($scope, $rootScope, $route, $routeParams , $window, $location, votingService) {


    }]);
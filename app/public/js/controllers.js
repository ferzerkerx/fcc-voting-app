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

        $scope.form = {};

        $scope.createPoll = function() {
            //TODO validate
            var form = $scope.form;

            var poll = {
                creator: 'someID',
                title:  form.title,
                options:  form.options.split('\n')
            };

            votingService.createPoll(poll).then(function(data) {
                console.log("###createPoll" + data);
                $location.path('/poll-detail/' + data._id);
            });
        }

    }]);

votingControllers.controller('pollDetailController', ['$scope', '$route', '$routeParams' ,'$window','$location', 'votingService',
    function ($scope, $route, $routeParams , $window, $location, votingService) {

        $scope.form = {
            id:undefined,
            selectedOption:undefined,
            customOption:undefined
        };

        $scope.submitVote =  function() {
            $scope.form.id = $scope.poll._id;
            //TODO validate
            votingService.submitVote($scope.form).then(function() {
                $route.reload();//TODO do not reload
            });
        };


        function getPollDetails(pollId) {
            votingService.getPollDetails(pollId).then(function(data) {

                if (!data) {
                    //TODO
                    $location.path('/polls/');
                    return;
                }


                $scope.poll = data;
                renderChart($scope.poll);
            });
        }

        function renderChart(poll) {
            var backgroundColors = [];
            var votes = [];
            var options = [];

            for (var i = 0; i  < poll.options.length; i++) {
                var number = Math.floor(Math.random()*16777216);
                var color = '#'+ number.toString(16);
                backgroundColors.push(color);

                var option = poll.options[i];
                options.push(option.name);
                votes.push(option.votes);
            }



            var data = {
                labels: options,
                datasets: [
                    {
                        data: votes,
                        backgroundColor: backgroundColors
                    }]
            };

            var ctx = $("#myChart");
            new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {}
            });
        }

        getPollDetails($routeParams.pollId);
    }]);

votingControllers.controller('barController', ['$scope', '$rootScope', '$route', '$routeParams' ,'$window','$location', 'votingService',
    function ($scope, $rootScope, $route, $routeParams , $window, $location, votingService) {

        $scope.userDetails = {};
        $scope.twitterLogin = function() {
            votingService.doLogin();
        };

        $scope.twitterLogout = function() {
            votingService.doLogout().then(function() {
                $scope.userDetails = {};
                $location.path('/');
            });
        };

        votingService.userDetails().then(function(data) {
            $scope.userDetails = data;
        });



    }]);
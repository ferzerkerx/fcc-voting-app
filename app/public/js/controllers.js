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

        var listMyPolls = function() {
            votingService.listMyPolls().then(function(data) {
                $scope.polls = data;
            });
        };

        $scope.goToDetails =  function(pollId) {
            $location.path('/poll-detail/' + pollId);
        };

        listMyPolls();


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
            customOption:undefined,
            shouldShowCustomVote: false
        };

        $scope.submitVote =  function() {
            if (! $scope.form.selectedOption || $scope.form.selectedOption === "") {
                $scope.form.hasError = true;
                $scope.form.error = 'Please select an option';
                return;
            }

            if ($scope.form.selectedOption === "_custom" && (!$scope.form.customOption || $scope.form.customOption.length === 0)) {
                $scope.form.hasError = true;
                $scope.form.error = 'Please select a valid custom option';
                return;

            }
            var options = $scope.poll.options.map(function(poll) {
               return poll.name
            });
            if (options.indexOf($scope.form.customOption) >= 0) {
                $scope.form.hasError = true;
                $scope.form.error = "Can't have duplicate options.";
                return;
            }


            $scope.form.id = $scope.poll._id;

            votingService.submitVote($scope.form).then(function() {
                $route.reload();
            });
        };


        function getPollDetails(pollId) {
            votingService.getPollDetails(pollId).then(function(data) {
                if (!data) {
                    alert("Poll data couldn't be found.");
                    $location.path('/polls/');
                    return;
                }

                $scope.poll = data;


                renderChart($scope.poll);
            }, function () {
                alert("Poll data couldn't be found.");
                $location.path('/polls/');
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
        $('#options').change(function() {
            $scope.form.shouldShowCustomVote = ('_custom' === $("#options").val());
        });
    }]);

votingControllers.controller('barController', ['$scope', '$rootScope', '$route', '$routeParams' ,'$window','$location', 'votingService',
    function ($scope, $rootScope, $route, $routeParams , $window, $location, votingService) {

        $rootScope.userDetails = {};
        $scope.twitterLogin = function() {
            votingService.doLogin().then(function(data) {
                window.open(data.location,  "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
            });
        };

        $scope.twitterLogout = function() {
            votingService.doLogout().then(function() {
                $rootScope.userDetails = {};
                $location.path('/');
            });
        };

        votingService.userDetails().then(function(data) {
            $rootScope.userDetails = data;
        });



    }]);
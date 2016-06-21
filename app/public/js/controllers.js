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
            var form = $scope.form;
            form.hasError = false;
            form.error = undefined;

            if (! form.title || form.title === "") {
                form.hasError = true;
                form.error = 'Please specify a title.';
                return;
            }

            if (! form.options || form.options === "") {
                form.hasError = true;
                form.error = 'Please specify some options.';
                return;
            }

            var options = form.options.split('\n').sort();
            var uniqueOptions = [];
            $.each(options, function(i, el){
                if($.inArray(el, uniqueOptions) === -1) uniqueOptions.push(el);
            });


            if (options.length !== uniqueOptions.length) {
                form.hasError = true;
                form.error = "Can't have duplicated options.";
                return;
            }

            var poll = {
                creator: 'someID',
                title:  form.title,
                options:  options
            };

            votingService.createPoll(poll).then(function(data) {
                console.log("###createPoll" + data);
                $location.path('/poll-detail/' + data._id);
            });
        }

    }]);

votingControllers.controller('pollDetailController', ['$scope', '$rootScope', '$route', '$routeParams' ,'$window','$location', 'votingService',
    function ($scope, $rootScope,  $route, $routeParams , $window, $location, votingService) {

        $scope.form = {
            id:undefined,
            selectedOption:undefined,
            customOption:undefined,
            shouldShowCustomVote: false
        };

        $scope.submitVote =  function() {
            var form = $scope.form;
            form.hasError = false;
            form.error = undefined;
            if (! form.selectedOption || form.selectedOption === "") {
                form.hasError = true;
                form.error = 'Please select an option';
                return;
            }

            if (form.selectedOption === "_custom" && (!form.customOption || form.customOption.length === 0)) {
                form.hasError = true;
                form.error = 'Please select a valid custom option';
                return;

            }
            var options = $scope.poll.options.map(function(poll) {
               return poll.name
            });

            if (options.indexOf(form.customOption) >= 0) {
                form.hasError = true;
                form.error = "Can't have duplicate options.";
                return;
            }

            form.id = $scope.poll._id;
            votingService.submitVote(form).then(function() {
                $route.reload();
            });
        };


        $scope.deletePoll =  function() {
            var shouldDeletePoll = $window.confirm("Are you sure you want to delete this poll?");
            if (shouldDeletePoll === true) {
                votingService.deletePoll($scope.poll._id).then(function() {
                    $location.path('/polls/');
                });
            }
        };

        $scope.shouldShowDeleteButton =  function() {
            return $scope.poll && $scope.poll.creator === $rootScope.userDetails.username;
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
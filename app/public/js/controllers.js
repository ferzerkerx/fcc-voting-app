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
            var form = $scope.form;

            var poll = {
                creator: 'someID',
                title:  form.title,
                options:  form.options.split('\n')
            };

            votingService.createPoll(poll).then(function(data) {
                console.log("###createPoll" + data);
                //TODO go to details with id
                $location.path('/poll-detail/' + 1);

            });
        }

    }]);

votingControllers.controller('pollDetailController', ['$scope', '$route', '$routeParams' ,'$window','$location', 'votingService',
    function ($scope, $route, $routeParams , $window, $location, votingService) {

        function getPollDetails(pollId) {
            votingService.getPollDetails(pollId).then(function(data) {

                if (!data) {
                    //TODO
                    $location.path('/polls/');
                    return;
                }


                $scope.poll = data;
                renderChart();
            });
        }

        function renderChart() {

            var data = {
                labels: [
                    "Red",
                    "Blue",
                    "Yellow"
                ],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56"
                        ],
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56"
                        ]
                    }]
            };

            var ctx = $("#myChart");
            var myDoughnutChart = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {}
            });
        }

        getPollDetails($routeParams.pollId);
    }]);

votingControllers.controller('barController', ['$scope', '$rootScope', '$route', '$routeParams' ,'$window','$location', 'votingService',
    function ($scope, $rootScope, $route, $routeParams , $window, $location, votingService) {


    }]);

'use strict';

/* Services */

var votingServices = angular.module('votingServices', ['ngResource']);

votingServices.factory('votingService', ['$http', '$location',
    function($http, $location) {

        var appContext = $location.url().substring(0, $location.url().indexOf("/",2));

        var listPolls = function() {
            var url = appContext + '/api/polls';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var createPoll = function(poll) {
            var url = appContext + '/api/poll/new';
            return $http.post(url, poll).then(function (response) {
                return response.data;
            });
        };

        var getPollDetails = function(pollId) {
            var url = appContext + '/api/poll-details/' + pollId;
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var submitVote = function(data) {
            var url = appContext + '/api/poll/' + data.id + "/vote";
            return $http.post(url, data).then(function (response) {
                return response.data;
            });
        };

        return {
            listPolls: listPolls,
            createPoll: createPoll,
            getPollDetails: getPollDetails,
            submitVote: submitVote,
        };
    }]);


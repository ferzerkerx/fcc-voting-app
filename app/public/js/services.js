
'use strict';

/* Services */

var votingServices = angular.module('votingServices', ['ngResource']);

votingServices.factory('votingService', ['$http', '$location',
    function($http, $location) {

        var appContext = $location.absUrl();
        if (appContext.indexOf("#")) {
            appContext =  appContext.substring(0, appContext.indexOf("#") - 1);
        }

        var listPolls = function() {
            var url = appContext + '/api/polls';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var listMyPolls = function() {
            var url = appContext + '/api/my-polls';
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

        var deletePoll = function(pollId) {
            var url = appContext + '/api/poll/' + pollId;
            return $http.delete(url).then(function (response) {
                return response.data;
            });
        };


        var doLogin = function() {
            var url = appContext + '/api/twitter/requestLogin';
            return $http.post(url).then(function (response) {
                return response.data;
            });
        };

        var doLogout = function() {
            var url = appContext + '/api/logout';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var userDetails = function() {
            var url = appContext + '/api/userDetails';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        return {
            listPolls: listPolls,
            listMyPolls: listMyPolls,
            createPoll: createPoll,
            getPollDetails: getPollDetails,
            submitVote: submitVote,
            deletePoll: deletePoll,
            doLogin: doLogin,
            doLogout: doLogout,
            userDetails: userDetails
        };
    }]);


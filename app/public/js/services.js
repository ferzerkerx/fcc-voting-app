
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

        return {listPolls: listPolls};
    }]);


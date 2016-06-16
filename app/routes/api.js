'use strict';

var path = process.cwd();
var APIService = require(path + '/app/service/APIService.js');

module.exports = function (app) {

    var apiService = new APIService();

    app.route('/api/polls')
        .get(apiService.listPolls);

};
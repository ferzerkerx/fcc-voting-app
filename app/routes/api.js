'use strict';

var path = process.cwd();
var ApiService = require(path + '/app/service/ApiService.js');

module.exports = function (app) {

    var apiService = new ApiService();

    app.route('/api/polls')
        .get(apiService.listPolls);

    app.route('/api/poll/new')
        .post(apiService.createPoll);

    app.route('/api/poll/:pollId/vote')
        .post(apiService.votePoll);

    app.route('/api/poll-details/:pollId')
        .get(apiService.pollDetails);

    app.route('/api/userDetails')
        .get(apiService.userDetails);

    app.route('/api/twitter/requestLogin')
        .post(apiService.twitterRequestLogin);

    app.route('/api/twitter/callback')
        .get(apiService.twitterCallback);

    app.route('/api/logout')
        .get(apiService.doLogout);

};
'use strict';

var path = process.cwd();
var APIService = require(path + '/app/service/APIService.js');

module.exports = function (app) {

    var apiService = new APIService();

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
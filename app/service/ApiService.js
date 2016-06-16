'use strict';

var path = process.cwd();
var Poll = require(path + '/app/models/Poll.js');
var OAuth = require('oauth');

function ApiService () {

    this.listPolls = function (req, res) {
        var polls = ['some Poll'];

        return res.json(polls);
    };

    this.authenticate = function (req, res) {
        var OAuth2 = OAuth.OAuth2;
        var twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
        var twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
        var oauth2 = new OAuth2(twitterConsumerKey,
            twitterConsumerSecret,
            'https://api.twitter.com/',
            null,
            'oauth2/token',
            null);
        oauth2.getOAuthAccessToken(
            '',
            {'grant_type':'client_credentials'},
            function (e, access_token, refresh_token, results){
                console.log('bearer: ',access_token);
                done();
            });
    };
}

module.exports = ApiService;
'use strict';

var path = process.cwd();
var Poll = require(path + '/app/models/Poll.js');
var OAuth = require('oauth');
var qs = require("qs");

function ApiService () {

    this.listPolls = function (req, res) {

        Poll.find({}, function(err, polls){
            if (err) {
                console.log(err);
                return res.json(500, {});
            }
            return res.json(polls);
        });
    };

    this.listMyPolls = function (req, res) {

        Poll.find({creator: req.session.userData.userName}, function(err, polls){
            if (err) {
                console.log(err);
                return res.json(500, {});
            }
            return res.json(polls);
        });
    };

    //TODO validate this service is only invoked whenever a session is present
    this.createPoll = function (req, res) {

        var options = req.body.options;

        var optionsWithVotes = options.map(function(option) {
            return {
                name: option,
                votes: 0
            }
        });
        var poll = new Poll({
            creator: req.session.userData.userName,
            title: req.body.title,
            options: optionsWithVotes
        });

        poll.save(function (err, poll) {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            return res.json(poll);
        });
    };

    this.pollDetails = function (req, res) {
        var pollId =  req.params.pollId;
        Poll.findOne({_id:pollId}, function(err, poll){
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            return res.json(poll);
        });
    };

    this.userDetails = function(req, res) {
        var session = req.session;
        var userDetails = {
            name: undefined,
            isLogged: false
        };
        if (session.hasOwnProperty('userData')) {
            userDetails.isLogged = true;
            userDetails.name = session.userData.name;
        }
        return res.json(userDetails);

    };

    this.votePoll = function (req, res) {
        var pollId =  req.params.pollId;
        var selectedOption = req.body.selectedOption;
        var customOption = req.body.customOption;


        Poll.findOne({ _id: pollId }, function(err, poll) {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            if (customOption) {
                poll.options.push({
                    name: customOption,
                    votes: 0
                })
            }
            else {
                for (var i = 0; i < poll.options.length; i++) {
                    if (poll.options[i].name === selectedOption) {
                        poll.options[i].votes++;
                    }
                }
            }

            poll.save(function (err, poll) {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
                return res.json(poll);
            });
        });
    };

    var twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
    var twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
    var oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        twitterConsumerKey,
        twitterConsumerSecret,
        '1.0A',
        'http://127.0.0.1:8080/api/twitter/callback',
        'HMAC-SHA1'
    );


    this.twitterRequestLogin = function (req, res) {
        oauth.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret){
            req.session.oauth_token_secret = oauth_token_secret;
            res.json({'location': 'https://api.twitter.com/oauth/authenticate?oauth_token=' + oauth_token});
        });
    };

    this.twitterCallback = function(req, res) {
        var urlParams = req.url.substring(req.url.indexOf('?') + 1);
        var urlComponents = qs.parse(urlParams);
        var oauth_token = urlComponents.oauth_token;
        var oauth_verifier = urlComponents.oauth_verifier;

        var getOAuthRequestTokenCallback = function (err, oAuthAccessToken,
                                                     oAuthAccessTokenSecret) {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json',
                oAuthAccessToken,
                oAuthAccessTokenSecret,
                function (err, twitterResponseData) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }

                    var parsedData = JSON.parse(twitterResponseData);
                    req.session.userData = {name: parsedData.name, userName: parsedData.screen_name};

                    return res.redirect('/');
                });
        };

        oauth.getOAuthAccessToken(oauth_token, req.session.oauth_token_secret, oauth_verifier,
            getOAuthRequestTokenCallback);

    };

    this.doLogout = function(req, res) {
        req.session.destroy();
        return res.json({status: 'ok'});
    };
}

module.exports = ApiService;
'use strict';

var path = process.cwd();
var Poll = require(path + '/app/models/Poll.js');
var OAuth = require('oauth');

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

    this.createPoll = function (req, res) {

        var options = req.body.options;

        var optionsWithVotes = options.map(function(option) {
            return {
                name: option,
                votes: 0
            }
        });
        var poll = new Poll({
            creator: req.body.creator, //TODO maybe get it from session?
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
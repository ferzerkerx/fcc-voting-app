'use strict';

var path = process.cwd();
var Poll = require(path + '/app/models/Poll.js');

function ApiService () {

    this.listPolls = function (req, res) {
        var polls = ['some Poll'];

        return res.json(polls);
    };
}

module.exports = ApiService;
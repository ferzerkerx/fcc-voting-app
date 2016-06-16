'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    title: String,
    options: { type : Array , "default" : [] }
});

module.exports = mongoose.model('Poll', Poll);
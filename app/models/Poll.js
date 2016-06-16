'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Poll = new Schema({
    creator: String, //TODO Use objectId?
    title: String,
    options: { type : Array , "default" : [] }
});

module.exports = mongoose.model('Poll', Poll);
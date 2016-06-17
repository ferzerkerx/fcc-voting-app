'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var OptionSchema = new Schema({ name: String, votes: { type : Number , "default" : 0 }});

var Poll = new Schema({
    creator: String, //TODO Use objectId?
    title: String,
    options: [OptionSchema]
});

module.exports = mongoose.model('Poll', Poll);
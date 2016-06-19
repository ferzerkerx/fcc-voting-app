'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionSchema = new Schema({ name: String, votes: { type : Number , "default" : 0 }});

var Poll = new Schema({
    creator: String,
    title: String,
    options: [OptionSchema]
});

module.exports = mongoose.model('Poll', Poll);
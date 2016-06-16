'use strict';

var express = require('express');
var mongoose = require('mongoose');

var routesIndex = require('./app/routes/index.js');
var routesApi = require('./app/routes/api.js');

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

app.use('/public', express.static(process.cwd() + '/app/public'));

routesIndex(app);
routesApi(app);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
    console.log('Node.js listening on port ' + port + '...');
});

"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const rpcRouter = require('./api/rpcRouter');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Remote Procedure Call は
// express router として /api/rpcRouter.js で実装
app.use(rpcRouter);

app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(config.server.port, config.server.listen, () => {
    var info = ['1000 builder listening on ', config.server.listen, ':', config.server.port].join('');
    console.log(info);
});

"use strict";

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const rpcRouter = require('./api/rpcRouter');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time'));
app.use(bodyParser.json());

// Remote Procedure Call は
// express router として /api/rpcRouter.js で実装
app.use(rpcRouter);

app.get('/', (req, res) => {
  res.sendfile(__dirname + '/public/index.html');
});

var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, '0.0.0.0', () => {
    console.log("1000-builder starting on " + appEnv.url);
});

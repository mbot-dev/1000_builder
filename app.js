'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const rpcRouter = require('./api/rpcRouter');
const BLUEMIX = false;

var app = express();

// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
if (BLUEMIX) {
	app.enable('trust proxy');
	app.use ((req, res, next) => {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
	});
}
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

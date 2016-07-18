'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const logger = require('./log/logger');
const indexRouter = require('./api/indexRouter');
const authRouter = require('./api/authRouter');
const simpleRouter = require('./api/simpleRouter');

const app = express();
const appEnv = cfenv.getAppEnv();
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time'));
app.use(express.static(__dirname + '/public'));
app.use(indexRouter);
app.use(authRouter);
app.use(simpleRouter);

// Start Server
const server = app.listen(appEnv.port, appEnv.bind, () => {
    var info = ['Listening on ', server.address().address, ':', server.address().port].join('');
    logger.info(info);
});

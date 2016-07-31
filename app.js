'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const helmet = require('helmet');
const logger = require('./log/logger');
const indexRouter = require('./api/indexRouter');
const authRouter = require('./api/authRouter');
const simpleRouter = require('./api/simpleRouter');

const app = express();
(function (param) {
	if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
		param.enable('trust proxy');
		param.use (function (req, res, next) {
	        if (req.secure) {
				next();
	        } else {
				res.redirect('https://' + req.headers.host + req.url);
	        }
		});
	}
})(app);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time'));
app.use(express.static(__dirname + '/public'));
app.use(indexRouter);
app.use(authRouter);
app.use(simpleRouter);

// Start Server
var appEnv = cfenv.getAppEnv();
var server = app.listen(appEnv.port, appEnv.bind, function () {
    var info = ['Listening on ', server.address().address, ':', server.address().port].join('');
    logger.info(info);
});

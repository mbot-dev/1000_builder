'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const helmet = require('helmet');
const config = require('config');
const logger = require('./logger/logger');
const indexRouter = require('./api/indexRouter');
const authRouter = require('./api/authRouter');
const simpleRouter = require('./api/simpleRouter');

const app = express();
(function (param) {
	if (process.env.VCAP_APPLICATION) {
		param.enable('trust proxy');
		param.use ((req, res, next) => {
			if (req.secure) {
				next();
			} else {
				res.redirect('https://' + req.headers.host + req.url);
			}
		});
	}
})(app);
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", "'unsafe-inline'"],
		styleSrc: ["'self'", 'www.w3schools.com'],
		imgSrc: ["'self'"]
	}
}));
app.use(bodyParser.json({limit: '256mb'}));
app.use(bodyParser.urlencoded({limit: '256mb', extended: true}));
app.use(morgan(':remote-addr [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time'));
app.use(express.static(__dirname + '/public'));
app.use(indexRouter);
app.use(config.path.oauth2, authRouter);
app.use(config.path.simple, simpleRouter);

// Start Server
const appEnv = cfenv.getAppEnv();
const server = app.listen(appEnv.port, appEnv.bind, () => {
    var info = ['Listening on ', server.address().address, ':', server.address().port].join('');
    logger.info(info);
});

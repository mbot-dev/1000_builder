'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const helmet = require('helmet');
const config = require('config');
const logger = require('./logger/logger');
const authRouter = require('./api/authRouter');
const simpleRouter = require('./api/simpleRouter');

const app = express();
(function (param) {
	if (process.env.VCAP_APPLICATION) {
		param.enable('trust proxy');
		param.use ((req, res, next) => {
			if (req['secure']) {
				next();
			} else {
				res.redirect('https://' + req.headers.host + req.url);
			}
		})
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(config['path']['oauth2'], authRouter);
app.use(config['path']['simple'], simpleRouter);

// Start Server
if (process.env.VCAP_APPLICATION) {
	const appEnv = cfenv.getAppEnv();
	const server = app.listen(appEnv.port, appEnv.bind, () => {
		const info = ['Listening on ', server.address().address, ':', server.address().port].join('');
		logger.info(info)
	})

} else {
	const server = app.listen(6001, '0.0.0.0', () => {
		const info = ['Listening on ', server.address().address, ':', server.address().port].join('');
		logger.info(info);
	})
}



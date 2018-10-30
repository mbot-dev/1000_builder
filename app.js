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

const startInfo = (server) => {
  const { address } = server.address();
  const { port } = server.address();
  logger.info(`Listening on ${address} : ${port}`);
};

// Start Server
if (process.env.VCAP_APPLICATION) {
	const appEnv = cfenv.getAppEnv();
	const server = app.listen(appEnv.port, appEnv.bind, () => {
		startInfo(server);
	})
} else {
	let port = 6001;
	const array = process.argv;
	if (array.length > 2) {
		const strPort = array.slice(2);
		port = parseInt(strPort);
	}
	const server = app.listen(port, '0.0.0.0', () => {
		startInfo(server);
	});
}

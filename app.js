'use strict';

const server = require('http').createServer();
const express = require('express');
const jwt = require('jwt-simple');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const config = require('config');
const logger = require('./log/logger');
const db = require('./db/db');
const simpleBuilder = require('./api/simpleBuilder');

const SECRET = 'GM2DMMRRGU3TKMBQ';
const TOKENTIME = 120 * 60; // in seconds
// const TOKENTIME = 10; // in seconds

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
app.use(express.static(__dirname + '/public'));
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var invalidRequest = function () {
    return {
        errors: [{
            message: 'Unable to verify your credentials',
            code: 99
        }]
    };
};

var incorrectKey = function () {
    return {
        errors: [{
            message: "Incorrect consumer key or secret",
            code: 89
        }]
    };
};

var invalidToken = function () {
    return {
        errors: [{
            message: "Invalid or expired token",
            code: 89
        }]
    };
};

var bodyCheck = function (req, res, next) {
    var grant_type = req.body.grant_type;
    logger.debug(req.body);
    if (grant_type === 'client_credentials') {
        next();
    } else {
        res.status(403).json(invalidRequest());
    }
};

var basicTest = function (req, res, next) {
    var auth = req.get('Authorization');
    logger.debug(auth);
    if (auth === 'Undefined' || !auth.startsWith('Basic ')) {
        res.status(403).json(invalidRequest());
        return;
    }
    var index = auth.indexOf(' ');
    var decoded = new Buffer(auth.substring(index+1), 'base64').toString();
    logger.debug(decoded);
    var arr = decoded.split(':');
    db.authenticate(arr[0], arr[1], (err, user) => {
        if (err) {
            res.status(401).json(incorrectKey());
        } else {
            req.user = user;
            next();
        }
    });
};

var generateToken = function (req, res, next) {
    var expires = Math.floor(Date.now() / 1000) + TOKENTIME;
    var payload = {
        iss: '1000-builder',
        id: req.user.id,
        exp: expires
    };
    req.token = jwt.encode(payload, SECRET);
    logger.debug(req.token);
    next();
};

var respond = function (req, res) {
    res.status(200).json({
        token_type: 'bearer',
        access_token: req.token
    });
};

var authenticate = function (req, res, next) {
    var auth = req.get('Authorization');
    logger.debug(auth);
    if (auth === 'Undefined' || !auth.startsWith('Bearer ')) {
        res.status(403).json(invalidRequest());
        return;
    }
    var index = auth.indexOf(' ');
    var token = auth.substring(index+1);
    try {
        var decoded = jwt.decode(token, SECRET);
        logger.debug(decoded);
        next();
    } catch (err) {
        res.status(401).json(invalidToken());
    }
};

app.post('/oauth2/token',
    bodyCheck,
    basicTest,
    generateToken,
    respond
);

app.post('/1000/simple/v1', authenticate, (req, res) => {
    var parsed = req.body;
    logger.debug(parsed);
    var mml = simpleBuilder.build(parsed);
    logger.debug(mml);
    res.status(200).json({
        result: 'success',
        mml: mml
    });
});

// Start Server
server.on('request', app);
server.listen(appEnv.port, appEnv.bind, () => {
    var info = ['Listening on ', server.address().address, ':', server.address().port].join('');
    logger.info(info);
});

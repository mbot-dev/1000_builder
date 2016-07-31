'use strict';

const express = require('express');
const config = require('config');
const jwt = require('jwt-simple');
const logger = require('../log/logger');
const simpleBuilder = require('../api/simpleBuilder');

const router = express.Router();

function sendError (status, err, req, res) {
	var message = {
		error: err
    };
	res.status(status);
	res.header('Content-Type', 'application/json;charset=UTF-8');
	res.header('Cache-Control', 'no-store');
	res.header('Pragma', 'no-cache');
	res.end(JSON.stringify(message));
}

function authenticate (req, res, next) {
    var auth = req.get('Authorization');
    logger.debug(auth);
    if (!auth || !auth.startsWith('Bearer ')) {
		sendError(400, 'invalid_request', req, res);
    } else {
		var index = auth.indexOf(' ');
	    var token = auth.substring(index+1);
	    try {
			// secret == demo
	        var decoded = jwt.decode(token, config.jwt.secret_demo);
	        logger.debug(decoded);
	        next();
	    } catch (err) {
			sendError(401, 'invalid_grant', req, res);
	    }
	}
}

router.post(config.path.simple, authenticate, (req, res) => {
    var parsed = req.body;
    logger.debug(parsed);
    simpleBuilder.build(parsed, (mml) => {
		logger.debug(mml);
	    res.status(200).json({
	        result: 'success',
	        mml: mml
	    });
	});
});

module.exports = router;

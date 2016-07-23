'use strict';

const express = require('express');
const config = require('config');
const jwt = require('jwt-simple');
const logger = require('../log/logger');
const db = require('../db/db');

var router = express.Router();

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

function checkBody (req, res, next) {
	logger.debug(req.body);
	if (req.body.grant_type !== 'client_credentials') {
		sendError(400, 'invalid_request', req, res);
	} else {
		next();
	}
}

function checkCredential (req, res, next) {
    var auth = req.get('Authorization');
    logger.debug(auth);
	if (!auth || !auth.startsWith('Basic ')) {
		sendError(400, 'invalid_request', req, res);
	} else {
		var index = auth.indexOf(' ');
	    var decoded = new Buffer(auth.substring(index+1), 'base64').toString();
	    logger.debug(decoded);
	    var arr = decoded.split(':');
	    db.authenticate(arr[0], arr[1], (err, user) => {
	        if (err) {
				return sendError(401, 'invalid_client', req, res);
	        } else {
	            req.user = user;
	            next();
	        }
	    });
	}
}

function generateToken (req, res, next) {
    var expires = Math.floor(Date.now() / 1000) + config.jwt.expires;
    var payload = {
        iss: config.jwt.iss,
        exp: expires
    };
    req.token = jwt.encode(payload, config.jwt.secret);
    logger.debug(req.token);
    next();
}

function respond (req, res) {
	var result = {
        token_type: config.jwt.token_type,		// beare
        access_token: req.token,				// jwt
		expires_in: config.jwt.expires			// in seconds
    };
	res.status(200);
	res.header('Content-Type', 'application/json;charset=utf-8');
	res.header('Cache-Control', 'no-store');
	res.header('Pragma', 'no-cache');
	res.end(JSON.stringify(result));
}

router.post (
	config.path.oauth2,
	checkBody,
	checkCredential,
	generateToken,
	respond
);

module.exports = router;

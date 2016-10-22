'use strict';

const express = require('express');
const config = require('config');
const uuid = require('node-uuid');
const logger = require('../logger/logger');
const jweSimple = require('../api/jweSimple');

const router = express.Router();

router.use((req, res, next) => {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    next();
});

var sendError = function (status, err, req, res) {
    var message = {
        error: err
    };
    res.status(status).json(message);
};

var checkBody = function (req, res, next) {
    try {
        if (req.body && req.body.grant_type === 'client_credentials') {
            next();
        } else {
            throw new Error("invalid_request");
        }
    } catch (error) {
        sendError(400, 'invalid_request', req, res);
    }
};

var checkCredential = function (req, res, next) {
    try {
        var basic = 'Basic ';
        var auth = req.get('Authorization');
        if (!auth || !auth.startsWith(basic)) {
            throw new Error("invalid_request");
        }
        var len = basic.length;
        var decoded = new Buffer(auth.substring(len), 'base64').toString();
        var arr = decoded.split(':');
        if (arr[0] === '2a1ecdd5-a1ec-4226-aaac-e42b8d602c1e' &&
                arr[1] === '5dbe45c15f68209ff401e1e218639c25e86067bb7d11438d9ca343681b1cc141') {
            req.user = {
                demo: true
            };
            next();
        } else {
            return sendError(401, 'invalid_client', req, res);
        }
    } catch (error) {
        return sendError(400, 'invalid_request', req, res);
    }
};

var generateToken = function (req, res, next) {
    var now = Date.now();
    var expires = Math.floor(now / 1000) + config.jwt.expires;
    var claim = {
        jti: uuid.v4(),
        iat: now,
        exp: expires
    };
    var key = new Buffer(config.jwt.secret_demo, 'hex');
    // logger.info(Buffer.byteLength(key)); = 32 ok
    req.token = jweSimple.compact(claim, key);
    // logger.info(req.token);
    next();
};

var respond = function (req, res) {
    var result = {
        token_type: config.jwt.token_type,      // beare
        access_token: req.token,                // jwt
        expires_in: config.jwt.expires			// in seconds
    };
    res.status(200).json(result);
};

router.post('/', [checkBody, checkCredential, generateToken, respond]);

module.exports = router;

'use strict';

const express = require('express');
const assert = require('assert');
const config = require('config');
const uuid = require('node-uuid');
const logger = require('../logger/logger');
const jweSimple = require('../api/jweSimple');
const utils = require('../lib/utils');

const dev_keys = [
    {
        consumer: '2a1ecdd5-a1ec-4226-aaac-e42b8d602c1e',
        secret: '5dbe45c15f68209ff401e1e218639c25e86067bb7d11438d9ca343681b1cc141'
    }
];

const router = express.Router();

router.use((req, res, next) => {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    next();
});

const checkBody = function (req, res, next) {
    try {
        assert.strictEqual(req.body.grant_type, 'client_credentials');
        next();
    } catch (err) {
        res.status(400).json({
            error: 'invalid_request'
        });
    }
};

const checkCredential = function (req, res, next) {
    try {
        var basic = 'Basic ';
        var auth = req.get('Authorization');
        var len = basic.length;
        var decoded = new Buffer(auth.substring(len), 'base64').toString();
        var arr = decoded.split(':');
        logger.info(arr[0]);
        logger.info(arr[1]);
        var match = false;
        for (var i=0; i<dev_keys.length; i++) {
            var key = dev_keys[i];
            if (arr[0] === key.consumer && arr[1] === key.secret) {
                match = true;
                break;
            }
        }
        if (match) {
            next();
        } else {
            assert.strictEqual('abc', 'edf', 'invalid_client');
        }
    } catch (err) {
        var status = (err.message === 'invalid_client') ? 401 : 400;
        res.status(status).json({
            error: err.message
        });
    }
};

const generateToken = function (req, res, next) {
    var now = Date.now();
    var expires = Math.floor(now / 1000) + config.jwt.expires;
    var claim = {
        jti: uuid.v4(),
        iat: now,
        exp: expires
    };
    var key = new Buffer(config.jwt.secret, 'hex');
    req.token = jweSimple.compact(claim, key);
    next();
};

const respond = function (req, res) {
    res.status(200).json({
        token_type: config.jwt.token_type,      // beare
        access_token: req.token,                // jwt
        expires_in: config.jwt.expires			// in seconds
    });
};

router.post('/', [checkBody, checkCredential, generateToken, respond]);

module.exports = router;

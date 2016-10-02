'use strict';

const express = require('express');
const config = require('config');
const logger = require('../log/logger');
const simpleBuilder = require('../api/simpleBuilder');
const jweSimple = require('../api/jweSimple');

const router = express.Router();

function sendError(status, err, req, res) {
    var message = {
        error: err
    };
    res.status(status);
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    res.end(JSON.stringify(message));
}

function authenticate(req, res, next) {
    try {
        var bearer = 'Bearer ';
        var auth = req.get('Authorization');
        if (!auth || !auth.startsWith(bearer)) {
            throw new Error("invalid_request");
        }
        var len = bearer.length;
        var token = auth.substring(len);
        var key = new Buffer(config.jwt.secret_demo, 'hex');
        var decoded = jweSimple.verify(token, key);
        logger.info(JSON.stringify(decoded));
        next();
    } catch (error) {
        sendError(401, 'invalid_grant', req, res);
    }
}

router.post(config.path.simple, authenticate, (req, res) => {
    var parsed = req.body;
    // logger.debug(parsed);
    simpleBuilder.build(parsed, (mml) => {
        res.status(200).json({
            result: 'success',
            mml: mml
        });
    });
});

module.exports = router;

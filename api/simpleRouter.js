'use strict';

const express = require('express');
const config = require('config');
const logger = require('../log/logger');
const jweSimple = require('../api/jweSimple');
const simpleBuilder = require('../api/simpleBuilder');
const mmlBuilder = require('../lib/mmlBuilder');

const router = express.Router();

router.use((req, res, next) => {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    next();
});

var sendError = function (status, err, req, res) {
    res.status(status).json({
        error: err
    });
};

// JWE verification
router.use((req, res, next) => {
    try {
        var bearer = 'Bearer ';
        var auth = req.get('Authorization');
        if (!auth || !auth.startsWith(bearer)) {
            throw new Error("invalid_request");
        }
        var len = bearer.length;
        var token = auth.substring(len);
        var key = new Buffer(config.jwt.secret_demo, 'hex');
        var payload = jweSimple.verify(token, key);
        // logger.info(JSON.stringify(payload));
        next();
    } catch (error) {
        sendError(401, 'invalid_grant', req, res);
    }
});

var generateXSDJson = function (req, res, next) {
    try {
        var contentType = req.params.contentType;
        var parsed = req.body;
        req.xsdJson = simpleBuilder.build(parsed, contentType);
        next();
    } catch (err) {
        sendError(500, err, req, res);
    }
};

var generateMml = function (req, res) {
    var mml = mmlBuilder.build(req.xsdJson);
    res.status(200).json({
        result: 'success',
        mml: mml
    });
};

router.post('/:contentType', [generateXSDJson, generateMml]);

module.exports = router;

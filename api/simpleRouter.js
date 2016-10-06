'use strict';

const express = require('express');
const config = require('config');
const logger = require('../log/logger');
const simpleBuilder = require('../api/simpleBuilder');
const jweSimple = require('../api/jweSimple');

const router = express.Router();

function sendError(status, err, req, res) {
    res.status(status).json({
        error: err
    });
}

router.use((req, res, next) => {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    next();
});

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

router.post('/:contentType', (req, res) => {
    var contentType = req.params.contentType;
    // logger.info(contentType);
    var parsed = req.body;
    // logger.debug(parsed);
    simpleBuilder.build(parsed, contentType, (error, mml) => {
        if (error) {
            res.status(500).json({
                error: 'MML生成エラー'
            });
        } else {
            res.status(200).json({
                result: 'success',
                mml: mml
            });
        }
    });
});

module.exports = router;

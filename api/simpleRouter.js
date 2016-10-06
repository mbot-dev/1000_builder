'use strict';

const express = require('express');
const config = require('config');
const logger = require('../log/logger');
const jweSimple = require('../api/jweSimple');
const simpleBuilder = require('../api/simpleBuilder');
const mmlBuilder = require('../lib/mmlBuilder');

const router = express.Router();

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

router.post('/:contentType', (req, res, next) => {
    try {
        var contentType = req.params.contentType;
        var parsed = req.body;
        var xsdJson = simpleBuilder.build(parsed, contentType);
        req.xsdJson = xsdJson;
        next();
    } catch (err) {
        sendError(500, 'MML 生成エラー', req, res);
    }
}, (req, res) => {
    var mml = mmlBuilder.build(req.xsdJson);
    res.status(200).json({
        result: 'success',
        mml: mml
    });
});

module.exports = router;

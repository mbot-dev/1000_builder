'use strict';

const express = require('express');
const config = require('config');
const fs = require('fs');
const utils = require('../lib/utils');
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
        // logger.info(JSON.stringify(parsed, null, 4));
        var wrapper = simpleBuilder.build(parsed, contentType);
        // logger.info(JSON.stringify(wrapper, null, 4));
        req.mmlWrapper = wrapper;
        next();
    } catch (err) {
        sendError(500, err, req, res);
    }
};

var generateMml = function (req, res, next) {
    try {
        // generate MML instance from json(XSD)
        var mml = mmlBuilder.build(req.mmlWrapper.json);
        // set json null
        req.mmlWrapper.json = null;
        // set mml generated one
        req.mmlWrapper.instance = mml;
        next();
    } catch (err) {
        sendError(500, err, req, res);
    }
};

var publish = function (req, res, next) {
    // publish
    var pretty = utils.formatXml(req.mmlWrapper.instance);
    var buf = new Buffer(pretty, 'utf8');
    var arr = [];
    arr.push(config.mmlOutput.path);
    arr.push('/');
    arr.push(req.mmlWrapper.fileName);
    arr.push('.xml');
    var path = arr.join('');
    fs.writeFile(path, buf, (err) => {
        // log
        logger.warn(err);
    });
    next();
};

var respond = function (req, res) {
    // respond
    res.status(200).json({
        result: 'success',
        mml: req.mmlWrapper.instance
    });
};

router.post('/:contentType', [generateXSDJson, generateMml, publish, respond]);

module.exports = router;

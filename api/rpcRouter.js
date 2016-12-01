'use strict';

const express = require('express');
const assert = require('assert');
const config = require('config');
const utils = require('../lib/utils');
const jweSimple = require('../api/jweSimple');
const simpleBuilder = require('../api/simpleBuilder');
const mmlBuilder = require('../lib/mmlBuilder');

var router = express.Router();

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
        res.status(401).json({
            error: 'invalid_grant'
        });
    }
});

// Returns error object
var buildError = (code, message, id) => {
    var err = {
        jsonrpc: '2.0',
        error: {
            code: code,
            message: message
        },
        id: id
    };
    return JSON.stringify(err);
};

var build = function (req, res) {
    // {jsonrpc: '2.0', method: 'build', params: [simpleComposition], id: 'uuid'}
    var jsonrpc = req.body.jsonrpc;
    var method = req.body.method;
    var params = req.body.params;
    var rpcId = req.body.id;

    try {
        assert.strictEqual(jsonrpc, '2.0', buildError(-32600, 'Invalid Request', rpcId));
        assert.strictEqual(method, 'build', buildError(-32601, 'Method not found', rpcId));
        assert.ok(Array.isArray(params), buildError(-32600, 'Invalid Request', rpcId));
    } catch (err) {
        res.send(err.message);
        return;
    }

    try {
        // Notificationでない時応答
        if (utils.isDefined(rpcId)) {
            // パラメータ
            var simpleComposition = params[0];
            var contentType = simpleComposition.context.contentType;    // RPC固有で必須

            // MML生成
            var wrapper = simpleBuilder.build(simpleComposition, contentType);
            var mml = mmlBuilder.build(wrapper.json);
            wrapper.mml = mml;
            wrapper.json = null;

            // レスポンス
            var response = {
                jsonrpc: '2.0',
                id: rpcId,
                result: {
                    mml: mml
                }
            };
            res.send(response);
        }

    } catch (err2) {
        console.log(err2);
        res.send(buildError(-1, err2.message, rpcId));
    }
};

// RPC route
router.post ('/', [build]);

module.exports = router;

'use strict';

const express = require('express');
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
    return {
        jsonrpc: '2.0',
        error: {
            code: code,
            message: message
        },
        id: id
    };
};

var build = function (req, res) {
    try {
        // {jsonrpc: '2.0', method: 'build', params: [simpleComposition], id: 'uuid'}
        var jsonrpc = req.body.jsonrpc;
        var method = req.body.method;
        var params = req.body.params;
        var rpcId = req.body.id;
        var response = {
            jsonrpc: '2.0',
            id: rpcId
        };

        if (utils.isUndefined(jsonrpc) || jsonrpc !== '2.0') {
            throw buildError(-32600, 'Invalid Request', rpcId);
        }
        if (utils.isUndefined(method) || method !== 'build') {
            throw buildError(-32601, 'Method not found', rpcId);
        }
        if (utils.isUndefined(params)) {
            throw buildError(-32600, 'Invalid Request', rpcId);
        }
        if (!Array.isArray(params)) {
            throw buildError(-32600, 'Invalid Request', rpcId);
        }

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

            // Send message broker wrapper
            if (config.appMode === 'prod') {
                // 稼働環境の場合のみ
        		publisher.publish(JSON.stringify(wrapper));
        	}

            // レスポンス
            response.result = {
                version: '4.0',
                mml: mml
            };
            res.send(response);
        }

    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

// RPC route
router.post ('/', [build]);

module.exports = router;

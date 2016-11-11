'use strict';

const express = require('express');
const config = require('config');
const utils = require('../lib/utils');
const logger = require('../logger/logger');
const jweSimple = require('../api/jweSimple');
const simpleBuilder = require('../api/simpleBuilder');
const mmlBuilder = require('../lib/mmlBuilder');
const publisher = require('../api/publisher');

const router = express.Router();

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

var build = function (req, res) {
    // パラメータ
    var contentType = req.params.contentType;
    var simpleComposition = req.body;
    var rpcId = simpleComposition.context.uuid;
    var response = {
        id: rpcId
    };
    try {
        // 生成する
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
            version: '4.0'
        };
        if (config.appMode !== 'prod') {
            // 稼働環境以外の時は結果のMMLを返す => 稼働環境では結果のMMLを返さない
            response.result.mml = mml;
        }
        res.status(200).json(response);

    } catch (err) {
        response.error = {
            code: 500,
            message: err
        };
        res.status(500).json(response);
    }
};

router.post('/:contentType', [build]);

module.exports = router;

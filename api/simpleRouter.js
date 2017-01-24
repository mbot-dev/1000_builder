'use strict';

const express = require('express');
const assert = require('assert');
const config = require('config');
const utils = require('../lib/utils');
const logger = require('../logger/logger');
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

// JWE verification
router.use((req, res, next) => {
    try {
        var bearer = 'Bearer ';
        var auth = req.get('Authorization');
        assert.ok(auth.startsWith(bearer), 'invalid_request');
        var len = bearer.length;
        var token = auth.substring(len);
        var key = new Buffer(config.jwt.secret, 'hex');
        var payload = jweSimple.verify(token, key);
        assert.ok(payload !== null, 'invalid_client');
        next();
    } catch (error) {
        var status = error.message === 'invalid_client' ? 401 : 400;
        res.status(status).json({
            error: error.message
        });
    }
});

var build = function (req, res) {
    try {
        // パラメータ
        var contentType = req.params.contentType;
        var simpleComposition = req.body;
        simpleComposition.context.contentType = contentType;
        var rpcId = simpleComposition.context.uuid;

        // 生成する
        var wrapper = simpleBuilder.build(simpleComposition, contentType);
        var mml = mmlBuilder.build(wrapper.json);
        logger.info(utils.formatXml(mml));
        wrapper.mml = mml;
        wrapper.json = null;

        // レスポンス
        res.status(200).json({
            id: rpcId,
            result: {
                mml: mml
            }
        });
    } catch (err) {
        logger.warn(err);
        var msg = '処理を実行できません。リクエストパラメータの設定やAPIデータの形式を確認してください。';
        res.status(500).json({
            error: msg
        });
    }
};

router.post('/:contentType', build);

module.exports = router;

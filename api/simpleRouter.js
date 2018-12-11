const assert = require('assert');
const express = require('express');
const config = require('config');
const utils = require('../lib/utils');
const logger = require('../logger/logger');
const jweSimple = require('../api/jweSimple');
const simpleBuilder = require('../api/simpleBuilder');
const mmlBuilder = require('../lib/mmlBuilder');
const buffer = require('buffer').Buffer;

const router = express.Router();

router.use((req, res, next) => {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    next();
});

// JWE verification
const verify = (req, res, next) => {
    try {
        const bearer = 'Bearer ';
        const auth = req.get('Authorization');
        assert.ok(auth.startsWith(bearer), 'invalid_request');
        const len = bearer.length;
        const token = auth.substring(len);
        const key = new Buffer(config.jwt.secret, 'hex');
        const payload = jweSimple.verify(token, key);
        assert.ok(payload !== null, 'invalid_client');
        next();
    } catch (error) {
        const status = error.message === 'invalid_client' ? 401 : 400;
        res.status(status).json({
            error: error.message
        });
    }
};

const build = (req, res) => {

  let contentType = req.params.contentType;
  let simpleComposition = req.body;
  simpleComposition.context.contentType = contentType;
  const rpcId = simpleComposition.context.uuid;
  logger.debug(JSON.stringify(simpleComposition, null, 3));

    try {
        // 生成する
        const wrapper = simpleBuilder.build(simpleComposition, contentType, false);
        const mml = mmlBuilder.build(wrapper.json, false);
        const formated = utils.formatXml(mml);
        logger.info(formated);
        wrapper.mml = mml;  // formated
        wrapper.json = null;

        // レスポンス
        // 整形して返す
        res.status(200).json({
            id: rpcId,
            result: {
                mml: wrapper.mml
            }
        });
    } catch (err) {
        logger.warn(err);
        if (simpleComposition) {
          logger.warn(JSON.stringify(simpleComposition, null, 3));
        }
        const msg = '処理を実行できません。リクエストパラメータの設定やAPIデータの形式を確認してください。';
        res.status(500).json({
           id: rpcId,
            error: msg
        });
    }
};

const deleteInstance = (req, res) => {
  const contentType = req.params.contentType;
  const simpleComposition = req.body;
  simpleComposition.context.contentType = contentType;
  const rpcId = simpleComposition.context.uuid;
  logger.debug('delete: ' + rpcId);

    try {
        // 生成する
        const wrapper = simpleBuilder.build(simpleComposition, contentType, true);
        const mml = mmlBuilder.build(wrapper.json, true);
        const formated = utils.formatXml(mml);
        logger.info(formated);
        wrapper.mml = mml;  // formated
        wrapper.json = null;

        // レスポンス 200
        res.status(200).json({
            id: rpcId,
            result: {
                mml: wrapper.mml
            }
        });
    } catch (err) {
        logger.warn(err);
        if (simpleComposition) {
          logger.warn(JSON.stringify(simpleComposition, null, 3));
        }
        const msg = '処理を実行できません。リクエストパラメータの設定やAPIデータの形式を確認してください。';
        res.status(500).json({
          id: rpcId,
            error: msg
        });
    }
};

if (config['jwt']['use_token']) {
	router.post('/:contentType', verify, build);
} else {
    router.post('/:contentType', build);
}

router.delete('/:contentType', deleteInstance);

module.exports = router;

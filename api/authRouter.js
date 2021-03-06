const express = require('express');
const assert = require('assert');
const config = require('config');
const uuid = require('uuid');
const jweSimple = require('../api/jweSimple');

const dev_keys = [
    {
        consumer: '2a1ecdd5-a1ec-4226-aaac-e42b8d602c1e',
        secret: '5dbe45c15f68209ff401e1e218639c25e86067bb7d11438d9ca343681b1cc141'
    },
    {
      consumer: '3855de23-71ce-4d08-9442-a52759414b5a',
      secret: '94205331440ee1f5025ccea9d1ddb6d04d5386de1e7606041c80bea44ed79922'
    },
    {
      consumer: '9faff368-258f-49ff-9efd-68a5c7054651',
      secret: 'db76162440b4e9438d97bb1cc8437fa0e06e28a083b881f7c2308d26c1c63bdd'
    },
    {
      consumer: '3541af22-f55e-4d83-82b9-fedac0397c57',
      secret: '556335d91610af13243a0995d9524b0d8a5c3caaf5a3625255831df5b3e4b68d'
    }
];

const router = express.Router();

router.use((req, res, next) => {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Cache-Control', 'no-store');
    res.header('Pragma', 'no-cache');
    next();
});

const checkBody = function (req, res, next) {
    try {
        assert.strictEqual(req.body['grant_type'], 'client_credentials');
        next();
    } catch (err) {
        res.status(400).json({
            error: 'invalid_request'
        });
    }
};

const checkCredential = function (req, res, next) {
    try {
        const basic = 'Basic ';
        const auth = req.get('Authorization');
        const len = basic.length;
        const decoded = new Buffer(auth.substring(len), 'base64').toString();
        const arr = decoded.split(':');
        // logger.info(arr[0]);
        // logger.info(arr[1]);
        let match = false;
        for (let i=0; i<dev_keys.length; i++) {
            const key = dev_keys[i];
            if (arr[0] === key.consumer && arr[1] === key.secret) {
                match = true;
                break;
            }
        }
        if (match) {
            next();
        } else {
            assert.strictEqual('abc', 'edf', 'invalid_client');
        }
    } catch (err) {
        const status = (err.message === 'invalid_client') ? 401 : 400;
        res.status(status).json({
            error: err.message
        });
    }
};

const generateToken = function (req, res, next) {
    const now = Date.now();
    const expires = Math.floor(now / 1000) + config['jwt']['expires'];
    const claim = {
        jti: uuid.v4(),
        iat: now,
        exp: expires
    };
    const key = new Buffer(config['jwt']['secret'], 'hex');
    req.token = jweSimple.compact(claim, key);
    next();
};

const respond = function (req, res) {
    res.status(200).json({
        token_type: config['jwt']['token_type'],      // beare
        access_token: req.token,                      // jwt
        expires_in: config['jwt']['expires']		  // in seconds
    });
};

const noTokenRespond = function (req, res) {
    res.status(200).json({
        token_type: config['jwt']['token_type'],      // beare
        access_token: 'Server is configured to allow access without access token',        // jwt
        expires_in: config['jwt']['expires']			// in seconds
    });
};

if (config['jwt']['use_token']) {
    router.post('/', [checkBody, checkCredential, generateToken, respond]);
} else {
    router.post('/', [noTokenRespond]);
}

module.exports = router;

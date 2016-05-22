"use strict";

const express = require('express');
const config = require('config');
const simpleBuilder = require('./simpleBuilder');
const mmlBuilder = require('../lib/mmlBuilder');

var router = express.Router();

// RPC method
function rpcMethod(simpleMML) {
    var mmlObj = simpleBuilder.buildMML(simpleMML);
    var mml = mmlBuilder.build(mmlObj);
    return mml;
};

// RPC route
router.post(config.rpc.path, function (req, res) {

    try {
        var body = req.body;

        // {jsonrpc: '2.0', method: 'build', params: [simpleMML], id: 'string'}

        if (!body.hasOwnProperty('jsonrpc') || body.jsonrpc !== '2.0') {
            throw {result: {code: -32600, message: 'Invalid Request'}};
        }
        if (!body.hasOwnProperty('method') ) {
            throw {result: {code: -32601, message: 'Method not found'}};
        }
        if (body.method !== config.rpc.method) {
            throw {result: {code: -32600, message: 'Invalid Request'}};
        }
        if (!body.hasOwnProperty('params')) {
            throw {result: {code: -32600, message: 'Invalid Request'}};
        }

        // Notification
        if (!body.hasOwnProperty('id')) {
            // No response;
        } else {
            var rpcId = body.id;               // id to return
            var arg = body.params[0];          // argmentはsimplMML一つ

            // call rpc method
            var mml = rpcMethod(arg);
            var response = {
                jsonrpc: '2.0',
                result: mml,
                id: rpcId
            };
            res.send(response);
        }
        
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;

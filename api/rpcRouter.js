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

// Returns error object
function createRPCError(code, message, id) {
    return {
        jsonrpc: '2.0',
        error: {
            code: code,
            message: message
        },
        id: id
    };
};

// RPC route
router.post(config.rpc.path, function (req, res) {

    try {
        var body = req.body;
        var rpcId = body.id;

        // {jsonrpc: '2.0', method: 'build', params: [simpleMML], id: 'string'}

        if (!body.hasOwnProperty('jsonrpc') || body.jsonrpc !== '2.0') {
            throw createRPCError(-32600, 'Invalid Request', rpcId);
        }
        if (!body.hasOwnProperty('method') ) {
            throw createRPCError(-32601, 'Method not found', rpcId);
        }
        if (body.method !== config.rpc.method) {
            throw createRPCError(-32600, 'Invalid Request', rpcId);
        }
        if (!body.hasOwnProperty('params')) {
            throw createRPCError(-32600, 'Invalid Request', rpcId);
        }

        // Notification
        if (rpcId === 'undefined') {
            // No response;
        } else {
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

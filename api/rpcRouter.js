"use strict";

const express = require('express');
const config = require('config');
const utils = require('../lib/utils');
const simpleBuilder = require('./simpleBuilder');

var router = express.Router();

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

// RPC route
router.post (config.rpc.path, function (req, res) {

    try {
        // {jsonrpc: '2.0', method: 'build', params: [simpleMML], id: 'string'}
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
        if (utils.isUndefined(method) ) {
            throw buildError(-32601, 'Method not found', rpcId);
        }
        if (utils.isUndefined(params)) {
            throw buildError(-32600, 'Invalid Request', rpcId);
        }

        // Notificationでない時応答
        if (utils.isDefined(rpcId)) {
            // rpcしてresult: へセット
            response.result = simpleBuilder[method].apply(simpleBuilder, params);
            res.send(response);
        }

    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;

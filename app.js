"use strict";

const rpc = require('json-rpc2');
const simpleBuilder = require('./api/simpleBuilder');
const mmlBuilder = require('./lib/mmlBuilder');

var server = rpc.Server.$create({
    'websocket': true, // is true by default
    'headers': { // allow custom headers is empty by default
        'Access-Control-Allow-Origin': '*'
    }
});

function build(args, opt, callback) {
    var mmlObj = simpleBuilder.buildMML(args[0]);
    var mml = mmlBuilder.build(mmlObj);
  callback(null, mml);
};

server.expose('build', build);

server.listen(8080, 'localhost');

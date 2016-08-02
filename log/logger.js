'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
    level: 'info',
    transports: [
        new (winston.transports.Console)({ json: false, timestamp: true })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true })
    ],
    exitOnError: false
});

module.exports = logger;

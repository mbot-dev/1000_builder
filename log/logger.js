var winston = require('winston');

var logger = new (winston.Logger)({
    level: 'info',
    transports: [
        new (winston.transports.Console)({ json: false, timestamp: true })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true }),
    ],
    exitOnError: false
});

module.exports = logger;

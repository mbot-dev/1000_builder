'use strict';

const appRoot = require('app-root-path');
const winston = require('winston');

const options = {
  file: {
    level: 'warn',
    filename: `${appRoot}/logs/api.log`,
    handleExceptions: true,
    json: false,
    maxsize: 4194304, // 4MB
    maxFiles: 10,
    colorize: false,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console(options['console']),
        new winston.transports.File(options['file'])
    ],
    exitOnError: false
});

module.exports = logger;

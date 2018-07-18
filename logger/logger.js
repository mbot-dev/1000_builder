'use strict';

const appRoot = require('app-root-path');
const winston = require('winston');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/api.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
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

const redis = require('redis');
const logger = require('../logger/logger');

const publisher = {};

const options = {
    host: 'localhost',
    port: 6379
};

const client = redis.createClient(options);

client.on('connect', () => {
  logger.info(`Redis publisher is connected to the ${options.host} on ${options.port}`);
});

publisher.publish = (topic, message) => {
  client.publish(topic, message);
  logger.info('redis published the message')
};

module.exports = publisher;

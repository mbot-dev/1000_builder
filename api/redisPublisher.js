const redis = require('redis');

const options = {
    host: 'localhost',
    port: 6379
};

const client = redis.createClient(options);

const publisher = {};

publisher.publish = (topic, message) => {
  client.publish(topic, message);
};

module.exports = publisher;

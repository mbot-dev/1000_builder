const Kafka = require('node-rdkafka');
const logger = require('../logger/logger');
const buffer = require('buffer').Buffer;

const producer = new Kafka.Producer({
  'metadata.broker.list': 'localhost:9092',
  'queue.buffering.max.messages': 100000,
  'queue.buffering.max.ms': 1000,
  'batch.num.messages': 1000000,
  'message.max.bytes': 1000000000,
  'dr_cb': true,
});

// logging debug messages, if debug is enabled
producer.on('event.log', (log) => {
  logger.info(log);
});

// logging all errors
producer.on('event.error', (err) => {
  logger.warn('Error from producer');
  logger.warn(err);
});

producer.on('delivery-report', (err, report) => {
  logger.info('delivery-report: ' + JSON.stringify(report));
  // counter++;
});

// Wait for the ready event before producing
producer.on('ready', (arg) => {
  logger.info('producer ready.' + JSON.stringify(arg));
});

producer.on('disconnected', (arg) => {
  logger.info('producer disconnected. ' + JSON.stringify(arg));
});

// starting the producer
producer.connect();

module.exports.produce = (topic, data) => {
  producer.produce(topic, null, buffer.from(data), 'utf8');
  producer.poll(0);
}

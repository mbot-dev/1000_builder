'use strict';

const mqlight = require('mqlight');
const config = require('config');
const logger = require('../logger/logger');

var publisher = {};
var sendClient = null;

// 送信クライアントを生成する
(function () {
	// プロダクションモード以外は送信しない
	if (config.appMode !== 'prod') {
		return;
	}
	var service = {
		service: 'amqp://localhost:5672'
	};
	var client = mqlight.createClient(service);
    client.on('started', () => {
        logger.info('MQ Light sender started sucessfully');
		sendClient = client;
    });
	client.on('error', (err) => {
        logger.error('MQ Light: ' + (err.message ? err.message : err));
		if (err instanceof mqlight.ReplacedError || err instanceof mqlight.SecurityError) {
            logger.error('Stopping due to error');
            process.exit(1);
        }
    });
})();

// Topicへ送信する
publisher.publish = function (message) {
	if (sendClient === null) {
		return;
	}
    var option = {
        qos: 1
    };
    sendClient.send(config.topic.base, message, option, (err, data) => {
        if (err) {
            logger.error(err);
        } else {
            logger.info('Sent: ' + data);
        }
    });
};

module.exports = publisher;

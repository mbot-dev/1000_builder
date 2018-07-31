const redis = require('redis');
const fs = require('fs');
const config = require('config');
const logger = require('./logger/logger');
const utils = require('./lib/utils');

const options = {
    host: 'localhost',
    port: 6379
};

const topicName = config['msg_sender']['topicName'];

const saveToFile = (data) => {
  const wrapper = JSON.parse(data);
  const { mml } = wrapper;
  const { fileName } = wrapper;
  // File components 1000 specification
  const fileParams = fileName.split('_');
  const createDatePart = fileParams[0];
  const { extArray } = wrapper;
  const pArray = [];
  // Pretty MML
  const pretty = utils.formatXml(mml);
  const buf = Buffer.from(pretty, 'utf8');
  // Path
  const arr = [];
  arr.push(config.mmlOutput.path);
  arr.push('/');
  arr.push(fileName);
  arr.push('.xml');
  const path = arr.join('');
  // 実際のFileは生成しないモード
  if (!config.mmlOutput.write) {
    return;
  }
  // MMLファイル
  const mmlP = new Promise((resolve, reject) => {
    fs.writeFile(path, buf, (err) => {
      if (err) {
        reject(err);
      } else {
        logger.info(fileName);
        resolve(null);
      }
    });
  });
  pArray.push(mmlP);
  // 外部参照ファイル
  extArray.forEach((e) => {
    const extContent = Buffer.from(e.base64, 'base64');
    const cmp = [config.mmlOutput.path];
    cmp.push('/');
    cmp.push(createDatePart);
    cmp.push('_');
    cmp.push(e.href);
    const extPath = cmp.join('');
    const p = new Promise((resolve, reject) => {
      fs.writeFile(extPath, extContent, (err) => {
        if (err) {
          reject(err);
        } else {
          logger.info(e.href);
          resolve(null);
        }
      });
    });
    pArray.push(p);
  });
  // Promise.all
  Promise.all(pArray).then(() => {
    // logger.info('Write all files successfully');
  }).catch((error) => {
    // One or more promises was rejected
    logger.warn(error);
  });
};

const client = redis.createClient(options);

client.on('connect', () => {
  logger.info(`Redis subscriber is connected to the ${options.host} on ${options.port}`);
  client.subscribe(topicName);
  logger.info(`subscribed to topic ${topicName}`)
});

client.on('message', (topic, data) => {
  logger.info('redis received the message');
  saveToFile(data);
});

client.on('error', (err) => {
  logger.error(`redis error: ${err}`);
});

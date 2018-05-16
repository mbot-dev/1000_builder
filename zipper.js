const co = require('co');
const fs = require('fs');
const glob = require('glob');
const archiver = require('archiver');
const config = require('config');
const logger = require('./logger/logger');

// const zipper = {};

const modules = [
  'mmlPi', 'mmlHi', 'mmlRd', 'mmlLs', 'mmlBc', 'mmlFcl', 'mmlPc',
  'mmlSg', 'mmlSm', 'mmlRe', 'mmlLb', 'mmlRp', 'mmlFs', 'mmlVs', 'mmlPs',
  'mmlInj', 'mmlHd',
];

const getSrcPath = (filename) => {
  const arr = [];
  arr.push(config.mmlOutput.path);
  arr.push(filename);
  return arr.join('/');
};

const getDestPath = (filename) => {
  const arr = [];
  arr.push(config.uploader.path);
  arr.push(filename);
  return arr.join('/');
};

const getFilePattern = (module) => {
  const arr = [];
  arr.push(config.mmlOutput.path);
  arr.push('/');
  arr.push('*_');
  arr.push(module);
  arr.push('_*');
  return arr.join('');
};

const getArchivePath = (filename) => {
  const fileComp = filename.split('_');
  const createDate = fileComp[0].substring(0, 'YYYYMMDD'.length);
  const module = fileComp[1];
  const fOid = fileComp[2];
  const arr = [createDate, '_', fOid, '_', module, '.zip'];
  const name = arr.join('');
  return getDestPath(name);
};

const readPromise = (module) => {
  return new Promise((resolve, reject) => {
    glob(getFilePattern(module), {}, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const arr = [];
        files.forEach((path) => {
          // drop directroy name
          const name = path.substring(config.mmlOutput.path.length + 1);
          // logger.info(name);
          arr.push(name);
        });
        resolve(arr);
      }
    });
  });
};

const archivePromise = (files) => {
  return new Promise((resolve, reject) => {
    // create a file to stream archive data to.
    const archivePath = getArchivePath(files[0]);
    const output = fs.createWriteStream(getArchivePath(files[0]));
    const archive = archiver('zip', {
      store: true, // Sets the compression method to STORE.
    });
    // listen for all archive data to be written
    output.on('close', () => {
      const size = archive.pointer();
      // logger.info(size + ' total bytes');
      logger.info('{size} total bytes');
      logger.info('archiver has been finalized and the output file descriptor has closed.');
      // const buf = new Buffer(size, 'utf8');
      const buf = Buffer.alloc(size, 'utf8');
      const textPath = archivePath.replace('.zip', '.txt');
      fs.writeFile(textPath, buf, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('success');
        }
      });
    });
    // good practice to catch this error explicitly
    archive.on('error', (err) => {
      reject(err);
    });
    // pipe archive data to the file
    archive.pipe(output);
    files.forEach((file) => {
      logger.info(file);
      // append a file
      archive.file(getSrcPath(file), { name: file });
    });
    // finalize the archive (ie we are done appending files but streams have to finish yet)
    archive.finalize();
  });
};

const deletePromise = (files) => {
  return new Promise((resolve, reject) => {
    files.forEach((f) => {
      fs.unlink(getSrcPath(f), (err) => {
        if (err) {
          reject(err);
        }
      });
      // logger.info(f + ' deleted');
    });
    resolve('success');
  });
};

const zip = () => {
  co(function* () {
    for (let i = 0; i < modules.length; i += 1) {
      const files = yield readPromise(modules[i]);
      if (files.length > 0) {
        yield archivePromise(files);
        yield deletePromise(files);
      }
    }
  }).catch((err) => {
    logger.warn(err.message);
  });
};

// module.exports = zipper;
zip();

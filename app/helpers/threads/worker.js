const { parentPort, workerData } = require('worker_threads');
const log4js = require('log4js');
const logger = log4js.getLogger('[Worker Template]');

logger.info('worker template init', workerData);

parentPort.postMessage({
	message: 'Hello from worker thread',
});

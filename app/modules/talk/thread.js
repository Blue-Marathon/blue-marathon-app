const { parentPort, workerData } = require('worker_threads');
const log4js = require('log4js');
const logger = log4js.getLogger('[Speech to Text Thread]');

logger.info('worker thread init', workerData);

(async () => {
	try {
		logger.info('thread started', workerData);
		parentPort.postMessage(workerData);
	} catch (error) {
		throw new Error(error);
	}
})();

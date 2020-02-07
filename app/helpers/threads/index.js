const { cpus } = require('os');
const { Worker } = require('worker_threads');
const log4js = require('log4js');
const logger = log4js.getLogger('[Thread Summoner]');

const MAX_THREADS = cpus().length;
const threads = new Set();

logger.info('Thread Summoner init', {
    MAX_THREADS,
});

// create worker instance, subscribe to events
const spawn = ({
	path,
	workerData,
	onError,
	onExit,
	onMessage,
}) => {
	try {
		if ((threads.size + 1) <= MAX_THREADS) {
			const worker = new Worker(path, {
				workerData,
			});
			worker.on('error', error => {
				logger.debug('error from worker thread', error);
				threads.delete(worker);
				onError(error);
			});
			worker.on('exit', () => {
				logger.debug('worker thread completed');
				threads.delete(worker);
				onExit();
			});
			worker.on('message', data => {
				onMessage(data);
			});
			threads.add(worker);
		} else {
			throw new Error('Max amount of threads reached', {
				MAX_THREADS,
				CURRENT: threads.size,
			});
		}
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = setup => {
	try {
		logger.debug('spawning worker threads', setup);
		if (Array.isArray(setup)) {
			return setup.map(worker => ({
				...worker,
				instance: spawn(worker),
			}));
		} else {
			return {
				...setup,
				instance: spawn(setup),
			};
		}
	} catch (error) {
		logger.error('error while trying to spawn worker threads', error);
		throw new Error(error);
	}
};

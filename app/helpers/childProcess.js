const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const summoner = require('child_process').spawn;
const log4js = require('log4js');
const logger = log4js.getLogger('[Child Process Helper]');

//parse child output
const parse = data => {
	let parsed = decoder.write(data);
	parsed = parsed.split(/\n\t*/);
	return parsed;
};

//spawn child process and run command on it, return after completion
const runCallback = (command, options, callback) => {
	try {
		const exec = summoner(command, options);
		let response = [];
		let errors = [];
		exec.stdout.on('data', data => {
			response = response.concat(parse(data));
		});
		exec.stderr.on('data', data => {
			errors = response.concat(parse(data));
		});
		exec.on('error', error => {
            logger.error('process error', error);
			callback(error, errors);
		});
		exec.on('close', code => {
			callback(errors, response, code);
		});
	} catch (error) {
        logger.error('process error', error);
		callback(error);
	}
};

//spawn child process and run command on it, emit steps on socket
const runSocket = (command, options, socket) => {
	try {
		const exec = summoner(command, options);
		socket.emit('start', JSON.stringify({
			command,
			options,
			socketId: socket.id
		}));
		exec.stdout.on('data', data => {
			socket.emit('data', JSON.stringify(parse(data)));
		});
		exec.stderr.on('data', data => {
			socket.emit('err', JSON.stringify(parse(data)));
		});
		exec.on('err', error => {
            logger.error('process error', error);
			socket.emit('err', JSON.stringify(parse(error)));
		});
		exec.on('close', code => {
			socket.emit('complete', JSON.stringify({
				code,
				command,
				options,
				socketId: socket.id,
			}));
		});
	} catch (error) {
        logger.error('process error', error);
		socket.emit('err', error);
	}
};

module.exports = {
    spawnWithCallback: runCallback,
	spawnWithSocket: runSocket,
};

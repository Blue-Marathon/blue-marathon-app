const config = require('./config');
const log4js = require('log4js');
const chalk = require('chalk');
const logger = log4js.getLogger('[API Main]');

// core modules
const { spawnWithCallback } = require('./helpers/childProcess');
const App = require('./app');
const Modules = require('./modules');
const Server = require('./server');
const Websocket = require('./websocket');

module.exports = async () => {
  // log App dir
  spawnWithCallback('ls', ['-la'], (error, result, code) => {
    if (error.length > 0 || code !== 0) {
      logger.error('Failed to list App dir', {
        code, error, result,
      });
    } else {
      logger.info('App dir', result);
    }
  });

  // create app instance
  try {
    const modules = Modules(config);
    const app = App(config, modules);
    const server = await Server.http(app, config.port);
    Websocket(server, config, modules); // bind talk module websocket event handlers

    logger.info(`
      Server started ${chalk.green('✓')}
      ${chalk.magenta(`running on port ${config.port}`)}
    `);
  } catch (error) {
    logger.error(`
      Error at Server startup ${chalk.red('x')}
      ${chalk.red(error.message)}
    `);
    logger.info(error);
  }
};

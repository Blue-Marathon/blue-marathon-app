const log4js = require('log4js');
const logLevel = process.env.LOG_LEVEL || 'debug';

log4js.configure({
  appenders: {
    log: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['log'], level: logLevel },
  },
  pm2: true,
});

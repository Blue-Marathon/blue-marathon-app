require('dotenv-safe').config();// load .env file into process.env
require('./logger');// load log4js config

const cloudant = require('./cloudant');
const watson = require('./watson');

const port = process.env.PORT || 3000;
const isLocal = process.env.NODE_ENV === 'local';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  port,
  isLocal,
  isDev,
  isProd,
  cloudant,
  watson,
};

const http = require('http');
const https = require('https');

const httpServer = async (app, port) => {
  try {
    const server = await (http.createServer(app)).listen(port);
    return server;
  } catch (error) {
    throw new Error(error.message);
  }
};

const httpsServer = async (app, port, options) => {
  try {
    const server = await (https.createServer(options, app)).listen(port);
    return server;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  http: httpServer,
  https: httpsServer
};

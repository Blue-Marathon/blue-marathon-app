const { Router } = require('express');
const getUptime = ((startTime) => () => (Date.now() - startTime))(Date.now());

module.exports = (app, modules) => {
  const api = Router();

  // build api endpoints
  api.use('/talk', modules.talk.router);

  // apply api endpoints to app
  app.use('/api', api);

  // health-check endpoint
  app.get('/health', (req, res) => {
    res.status(200).send({
      status: true,
      uptime_miliseconds: `${getUptime()}`
    });
  });
};

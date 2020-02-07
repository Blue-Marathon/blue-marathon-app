const path = require('path');
const express = require('express');
const timeout = require('connect-timeout');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const routes = require('./routes');

module.exports = (config, modules) => {
  const app = express();

  // setup webpack HMR if running this app on 'local' mode
  if (process.env.NODE_ENV === 'local') {
    const webpack = require('webpack');
    const webpack_dev = require('webpack-dev-middleware');
    const webpack_hot = require('webpack-hot-middleware');
    const local_config = require('../webpack.local');
    const compiler = webpack(local_config);
    app.use(webpack_dev(compiler, {
      noInfo: true,
      publicPath: '/',
      liveReload: true,
      hotOnly: false,
    }));
    app.use(webpack_hot(compiler));
  }

  // Add all middlewares to the Express pipeline
  app.use(timeout(300000)); // 5 min timeout, starts counting when the requests passes through this middleware on the pipeline
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // set api endpoints 
  routes(app, modules);

  // serve static files
  app.use('/', express.static(path.join(__dirname, './dist')));
  // app.get('*', (req, res) => { // redirect all domain root calls to client app
  //   res.sendFile(path.join(__dirname, './dist/index.html'));
  // });

  // catch timeout
  app.use((req, res, next) => {
    if (!req.timedout) next();
  });

  return app;
};

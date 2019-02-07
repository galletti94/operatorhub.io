const express = require('express');
const _ = require('lodash');

const loadService = require('./services/loadService');
const persistentStore = require('./store/persistentStore');
const routes = require('./routes/routes');
const mockOperators = require('./__mock__/operators');

const mockMode = false;

const app = express();

const setupApp = () => {
  app.set('port', process.env.PORT || 8080);
  // app.set('secureport', process.env.SECUREPORT || 8080);
  // routes
  routes(app);
};

const serverStart = err => {
  if (err) {
    console.error(`Error loading operators: ${_.get(err, 'response.data.message', err)}`);
  }

  app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`Express server listening on port ${app.get('port')}`);
  });

  // selfSignedHttps(app).listen(app.get('secureport'), () => {
  //   console.log(`Express secure server listening on port ${app.get('secureport')}`);
  // });

  // app.use(forceSSL);
};

// TO be used when we have a valid signed certificate
// const setupSSL = () => {
//   const secureOptions = {
//     key: fs.readFileSync(`${keysDirectory}/operatorhub.key`),
//     cert: fs.readFileSync(`${keysDirectory}/operatorhub.crt`)
//   };
// 
//   const secureServer = https.createServer(secureOptions, app);
// };

setupApp();

const populateDBMock = () => {
  persistentStore.setOperators(mockOperators);
  serverStart();
};

const populateDB = () => {
  loadService.loadOperators(serverStart);
};

const populate = mockMode ? populateDBMock : populateDB;

persistentStore.initialize(populate);

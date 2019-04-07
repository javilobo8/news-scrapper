(() => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const models = require('./models');
  const config = require('../config');

  models.connect(config.mongo.uri);
})();

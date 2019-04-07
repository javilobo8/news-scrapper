const { MongoMemoryServer } = require('mongodb-memory-server');

const config = require('../config');
const models = require('../src/models');

const mongod = new MongoMemoryServer();

module.exports = {
  connect: async () => {
    const connectionString = await mongod.getConnectionString('test-db');
    await models.connect(connectionString, config.mongo.options);
  },
  disconnect: async () => {
    await models.disconnect();
    await mongod.stop();
  },
};

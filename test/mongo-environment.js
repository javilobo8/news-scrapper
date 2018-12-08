const NodeEnvironment = require('jest-environment-node');
const { MongoMemoryServer } = require('mongodb-memory-server');

class MongoEnvironment extends NodeEnvironment {
  constructor(props) {
    super(props);
    this.mongod = new MongoMemoryServer({
      instance: {
        dbName: 'jest',
      },
      autoStart: false,
    });
  }

  async setup() {
    await super.setup();
    await this.mongod.start();
    this.global.__MONGOMS_URI__ = await this.mongod.getConnectionString();
  }

  async teardown() {
    await this.mongod.stop();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;

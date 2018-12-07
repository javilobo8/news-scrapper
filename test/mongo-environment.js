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
    console.log('Setup MongoDB Test Environment');
    await super.setup();
    await this.mongod.start();
    this.global.__MONGOMS_URI__ = await this.mongod.getConnectionString();
  }

  async teardown() {
    console.log('Teardown MongoDB Test Environment');
    await super.teardown();
    await this.mongod.stop();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;

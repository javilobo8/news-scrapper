const mongoose = require('mongoose');

class Models {
  constructor() {
    this.mongoose = mongoose;

    Object.assign(this, {
      Entry: require('./entry'),
      Target: require('./target'),
      Task: require('./task'),
    });
  }

  connect(uri) {
    return new Promise((resolve, reject) => {
      this.mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

      this.mongoose.connection.once('error', (err) => {
        console.error(this.constructor.name, 'ERROR =>', err);
        reject(err);
      });

      this.mongoose.connection.once('connected', () => {
        console.info(this.constructor.name, 'Connected');
        resolve();
      });
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.mongoose.connection.once('disconnected', () => {
        console.info(this.constructor.name, 'Disconnected');
        resolve();
      });

      this.mongoose.disconnect();
    });
  }
}

module.exports = new Models();

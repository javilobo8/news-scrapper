const mongoose = require('mongoose');

class Models {
  constructor() {
    this.mongoose = mongoose;

    this.Entry = require('./entry');
    this.Target = require('./target');
    this.Task = require('./task');

    this.mongoose.connection.once('error', (err) => {
      console.error(this.constructor.name, 'ERROR =>', err);
    });

    this.mongoose.connection.once('connected', () => {
      console.info(this.constructor.name, 'Connected');
    });

    this.mongoose.connection.once('disconnected', () => {
      console.info(this.constructor.name, 'Disconnected');
    });
  }

  connect(uri, options = {}) {
    const mongooseOptions = Object.assign({ useNewUrlParser: true, useCreateIndex: true }, options);
    this.mongoose.connect(uri, mongooseOptions);
  }

  disconnect() {
    return this.mongoose.disconnect();
  }
}

module.exports = new Models();

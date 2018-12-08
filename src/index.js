require('./globals');
const express = require('express');
const models = require('./models');
const config = require('./config');

const createServices = require('./services');
const createControllers = require('./controllers');

const createEmitter = require('./events');

const WebScrapper = require('./schedulers/webscrapper');

require('./db');

const app = express();

const services = createServices({ models, config });
const scrapper = new WebScrapper({ services });
const emitter = createEmitter({ scrapper });

const container = {
  models,
  config,
  services,
  scrapper,
  emitter,
};

if (!__TEST__) {
  container.scrapper.init();
}

createControllers(app, container);

module.exports = app;

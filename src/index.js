require('./globals');
require('./db');

const models = require('./models');
const config = require('../config');

const services = require('./services');
const WebScrapper = require('./schedulers/webscrapper');

const scrapper = new WebScrapper({ services });

const container = {
  models,
  config,
  services,
  scrapper,
};

if (!__TEST__) {
  container.scrapper.init();
}

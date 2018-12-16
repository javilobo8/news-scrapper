require('./globals');
const models = require('./models');
const config = require('./config');

const createServices = require('./services');
const WebScrapper = require('./schedulers/webscrapper');

require('./db');

const services = createServices({ models, config });
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

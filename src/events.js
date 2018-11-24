const EventEmitter = require('events');

module.exports = ({ scrapper }) => {
  const emitter = new EventEmitter();

  emitter.on('webscrapper:cancel', () => {
    console.log('webscrapper:cancel');
    scrapper.cancel();
  });

  emitter.on('webscrapper:reload', () => {
    console.log('webscrapper:reload');
    scrapper.reloadJobs();
  });

  return emitter;
};

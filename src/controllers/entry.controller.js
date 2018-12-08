const errorHandlers = require('../error-handlers');
const requestParams = require('../utils/build-received-request-params');

class EntryController {
  constructor(container) {
    this.path = '/entry';
    this.entryService = container.services.entryService;
  }

  getEntries(req, res) {
    Promise.resolve()
      .then(() => requestParams['getEntries'](req, res))
      .then(this.entryService.get.bind(this.entryService))
      .then(res.send.bind(res))
      .catch(errorHandlers.sendError(res));
  }
}

EntryController.routes = [
  {
    path: '/',
    method: 'get',
    bind: 'getEntries',
  },
];

module.exports = EntryController;

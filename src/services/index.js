const models = require('../models');
const config = require('../../config');

const RequestService = require('./request.service');
const TargetService = require('./target.service');
const EntryService = require('./entry.service');
const TaskService = require('./task.service');

module.exports = {
  requestService: new RequestService({ models, config }),
  targetService: new TargetService({ models, config }),
  entryService: new EntryService({ models, config }),
  taskService: new TaskService({ models, config }),
};

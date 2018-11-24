const logger = require('../utils/logger');

class TaskService {
  constructor({ models }) {
    this.TaskModel = models.Task;

    this.log = logger(this.constructor.name);
  }

  getActiveTasks() {
    return this.TaskModel.find({ active: true });
  }
}

module.exports = TaskService;

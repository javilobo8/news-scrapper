const errorHandlers = require('../error-handlers');

class TaskController {
  constructor(container) {
    this.path = '/task';
    this.taskService = container.services.taskService;

    this.emitter = container.emitter;
  }

  getActiveTasks(req, res) {
    this.taskService.getActiveTasks()
      .then(res.send.bind(res))
      .catch(errorHandlers.sendError(res));
  }

  cancelTasks(req, res) {
    this.emitter.emit('webscrapper:cancel');
    res.send({ message: 'OK' });
  }

  reloadTasks(req, res) {
    this.emitter.emit('webscrapper:reload');
    res.send({ message: 'OK' });
  }
}

TaskController.routes = [
  {
    path: '/active',
    method: 'get',
    bind: 'getActiveTasks',
  },
  {
    path: '/cancel',
    method: 'put',
    bind: 'cancelTasks',
  },
  {
    path: '/reload',
    method: 'put',
    bind: 'reloadTasks',
  },
];

module.exports = TaskController;

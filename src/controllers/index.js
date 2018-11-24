const { Router } = require('express');
const path = require('path');

const TaskController = require('./task');

/**
 * Creates a router from routes and binds to a controller.
 *
 * @param {Express} app
 * @param {Object} controller
 * @param {Object[]} routes
 */
function createRouterFromController(app, controller, routes) {
  const controllerRouter = new Router();

  routes.forEach((route) => {
    const routeArguments = [
      ...(route.middlewares || []),
      controller[route.bind].bind(controller),
    ];

    controllerRouter[route.method](route.path, routeArguments);

    // Log
    const fullPath = path.join('/', controller.path, route.path);
    const bindText = `${controller.constructor.name}::${route.bind}`;
    const routeText = `${route.method.toUpperCase()} ${fullPath}`;
    console.log(`Bound route ${routeText} to ${bindText}`);
  });

  app.use(controller.path, [controllerRouter]);
  console.log(`Bound ${controller.constructor.name}`);
}

/**
 * Creates all the controllers and routers and pass them to Express.
 *
 * @param {Express} app
 * @param {Object} container
 */
function createControllers(app, container) {
  console.log('Creating routes');
  const taskController = new TaskController(container);

  createRouterFromController(app, taskController, TaskController.routes);
  console.log('Routes initialized');
}

module.exports = createControllers;

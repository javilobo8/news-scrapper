/* eslint-disable no-restricted-syntax, import/no-dynamic-require */
const { Router } = require('express');
const path = require('path');
const fs = require('fs');

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

function getControllerNames() {
  return fs.readdirSync(__dirname)
    .reduce((previous, current) => {
      if (/\.controller\.js$/ig.test(current)) {
        previous.push(current);
      }
      return previous;
    }, []);
}

/**
 * Creates all the controllers and routers and pass them to Express.
 *
 * @param {Express} app
 * @param {Object} container
 */
function createControllers(app, container) {
  console.log('Creating controllers');
  const controllers = {};

  const controllerNames = getControllerNames();

  for (const controllerName of controllerNames) {
    const Controller = require(`./${controllerName}`);
    controllers[controllerName] = new Controller(container);
    createRouterFromController(app, controllers[controllerName], Controller.routes);
  }

  console.log('Controllers initialized');
  return controllers;
}

module.exports = createControllers;

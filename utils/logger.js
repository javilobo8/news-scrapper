/* eslint-disable arrow-body-style, func-names, prefer-arrow-callback */
/* eslint-disable no-param-reassign, no-restricted-syntax */
const chalk = require('chalk');

const methods = ['log', 'info', 'error', 'warn'];

function createLogger(context = '') {
  function Logger(...args) {
    console.log(chalk.bold(context), ...args);
  }

  for (const method of methods) {
    Logger[method] = (...args) => console[method](chalk.bold(context), ...args);
  }

  return Logger;
}

module.exports = createLogger;

const chalk = require('chalk');
const BluebirdPromise = require('bluebird');

global.Promise = BluebirdPromise;
global.__TEST__ = process.env.NODE_ENV === 'test';

if (!__TEST__) {
  const now = () => new Date().toISOString();
  const log = console.log;
  console.log = (...args) => log(chalk.green(`\n[${now()}] [LOG]:`), ...args);
  console.info = (...args) => log(chalk.blue(`\n[${now()}] [INFO]:`), ...args);
  console.warn = (...args) => log(chalk.yellow(`\n[${now()}] [WARN]:`), ...args);
  console.error = (...args) => log(chalk.red(`\n[${now()}] [ERROR]:`), ...args);
}

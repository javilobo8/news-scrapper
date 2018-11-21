require('./globals');
const Promise = require('bluebird');
const schedule = require('node-schedule');

const models = require('./models');
const RequestService = require('./services/request.service');
const TargetService = require('./services/target.service');
const EntryService = require('./services/entry.service');
const TaskService = require('./services/task.service');
const scrappers = require('./scrappers');
const seed = require('./seed');

const logger = require('./utils/logger');

const requestService = new RequestService({ models });
const targetService = new TargetService({ models });
const entryService = new EntryService({ models });
const taskService = new TaskService({ models });

class NewsBot {
  constructor() {
    this.currentTasks = [];

    this.log = logger(this.constructor.name);
  }

  async init() {
    this.log('Init');
    await models.connect('mongodb://127.0.0.1:27017/news');
    await seed(); // TODO: remove me

    this.reloadJobs();
  }

  /**
   * Iterates over existing schedules and cancels it.
   */
  cancelAllTasks() {
    this.currentTasks.forEach((currentTask) => currentTask.job.cancel());
    this.currentTasks = [];
  }

  /**
   * Starts all schedules with startOnCreate.
   */
  startTasks() {
    this.currentTasks.forEach((currentTask) => {
      if (currentTask.startOnCreate) {
        currentTask.job.invoke();
      }
    });
  }

  /**
   * Cancel current schedules and initiate new ones
   */
  async reloadJobs() {
    this.log('Reloading jobs');
    const tasks = await taskService.getActiveTasks();
    this.log(`Got ${tasks.length} task(s)`);

    this.cancelAllTasks();

    tasks.forEach((task, index) => {
      // TODO: Do it other way.
      function runSchedule() {
        this.runJob(task, index);
      }

      const job = schedule.scheduleJob(task.cron, runSchedule.bind(this));

      this.currentTasks.push({ ...task.toObject(), job });
    });

    this.log(`Created ${this.currentTasks.length} job(s)`);

    this.startTasks();
  }

  /**
   * Runs a Promise and use mapSeries to run all tasks from a run
   * in serie instead of use Promise.all
   *
   * @param {Object} task
   * @param {Number} index
   * @returns {Promise<>}
   */
  async runJob(task, index) {
    await Promise.resolve()
      .then(async () => {
        this.log(`Running Job #${index} (${task.name})`);
        await Promise.mapSeries(task.targets, this.runTaskTarget.bind(this));
      })
      .catch((error) => {
        this.log.error(`Error on Job #${index} (${task.name}) =>`, error, '\n');
        throw error;
      });
  }

  /**
   * Runs a scraping task from a targetId
   *
   * @param {ObjectId} targetId
   */
  async runTaskTarget(targetId) {
    this.log.info(`Running target ${targetId}`);
    const target = await targetService.getById(targetId);

    this.log(`Target name: ${target.name}`);
    const html = await requestService.call(target.http);

    const entries = scrappers[target.scrapperName](html);
    const entriesIds = entries.map((entry) => entry.entryId);

    const newEntriesIds = await entryService.filterNonExistentIds(entriesIds);
    const entriesToInsert = entries
      .filter((entry) => newEntriesIds.includes(entry.entryId))
      .map((entry) => ({ ...entry, targetId: target._id }));

    if (entriesToInsert.length) {
      await entryService.createMany(entriesToInsert);
    }

    this.log.info(`Run successful ${targetId}\n`);
  }
}

new NewsBot().init();

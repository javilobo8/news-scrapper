const schedule = require('node-schedule');

const scrappers = require('../scrappers');
const seed = require('../utils/seed');

const logger = require('../utils/logger');

class WebScrapper {
  constructor({ services }) {
    this.taskService = services.taskService;
    this.entryService = services.entryService;
    this.requestService = services.requestService;
    this.targetService = services.targetService;

    this.currentTasks = [];

    this.log = logger(this.constructor.name);
  }

  async init() {
    this.log('Init');
    await seed(); // TODO: remove me

    this.reloadJobs();
  }

  /**
   * Iterates over existing schedules and cancels it.
   */
  cancel() {
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
    const tasks = await this.taskService.getActiveTasks();
    this.log(`Got ${tasks.length} task(s)`);

    this.cancel();

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
        this.log.error(`Error on Job #${index} (${task.name}) =>`, error);
      });
  }

  /**
   * Runs a scraping task from a targetId
   *
   * @param {ObjectId} targetId
   */
  async runTaskTarget(targetId) {
    try {
      this.log.info(`Running target ${targetId}`);
      const target = await this.targetService.getById(targetId);

      this.log(`Target name: ${target.name}`);
      const html = await this.requestService.call(target.http);

      const entries = scrappers[target.scrapperName](html);
      const entriesIds = entries.map((entry) => entry.entryId);

      const newEntriesIds = await this.entryService.filterNonExistentIds(entriesIds);
      const entriesToInsert = entries
        .filter((entry) => newEntriesIds.includes(entry.entryId))
        .map((entry) => ({ ...entry, targetId: target._id }));

      if (entriesToInsert.length) {
        await this.entryService.createMany(entriesToInsert);
      }

      this.log.info(`Run successful ${targetId}`);
    } catch (error) {
      this.log.error('runTaskTarget ERROR', error);
    }
  }
}

module.exports = WebScrapper;

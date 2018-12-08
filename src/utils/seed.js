const models = require('../models');

const TARGETS = [
  {
    name: 'Darkumbra - Switch Content',
    scrapperName: 'darkumbra',
    description: 'Switch content games',
    tags: ['switch'],
    http: {
      client: 'axios',
      clientOptions: {
        maxRetries: undefined,
        timeout: undefined,
        waitPageLoad: undefined,
      },
      host: 'https://darkumbra.net',
      path: '/forums/forum/195-switch-games',
      method: 'get',
      params: {
        sortby: 'start_date',
        sortdirection: 'desc',
      },
    },
  },
  {
    name: 'PreDB',
    scrapperName: 'predb',
    description: 'Switch releases list page',
    tags: ['switch'],
    http: {
      client: 'puppeteer',
      clientOptions: {
        maxRetries: undefined,
        timeout: undefined,
        waitPageLoad: 5000,
      },
      host: 'https://predb.me',
      path: '',
      method: 'get',
      params: {
        search: 'nsw',
      },
    },
  },
  {
    name: 'NSWDB',
    scrapperName: 'nswdb',
    description: 'Switch releases list page',
    tags: ['switch'],
    http: {
      client: 'axios',
      clientOptions: {
        maxRetries: undefined,
        timeout: undefined,
        waitPageLoad: undefined,
      },
      host: 'http://nswdb.com/',
      path: '',
      method: 'get',
    },
  },
  {
    name: 'Reddit - SwitchHaxing/New',
    scrapperName: 'reddit-api',
    description: 'Reddit SwitchHaxing New posts',
    tags: ['switch'],
    http: {
      client: 'axios',
      clientOptions: {
        maxRetries: undefined,
        timeout: undefined,
        waitPageLoad: undefined,
      },
      host: 'https://www.reddit.com',
      path: '/r/SwitchHaxing/new.json',
      method: 'get',
    },
  },
];

module.exports = async function seed() {
  await models.Target.deleteMany();
  await models.Entry.deleteMany();
  await models.Task.deleteMany();

  await models.Target.create(TARGETS);

  const targetIds = (await models.Target.find({}, { _id: 1 })).map((t) => t._id);

  const tasks = [
    {
      name: 'TASK #1',
      description: 'Test task number 1',
      active: true,
      startOnCreate: true,
      cron: '* * * * *',
      targets: [...targetIds],
      emails: ['test@test.com'],
    },
    {
      name: 'TASK #2',
      description: 'Test task number 2',
      active: false,
      startOnCreate: false,
      cron: '* * * * *',
      targets: [targetIds[3]],
      emails: ['test@test.com'],
    },
  ];

  await models.Task.create(tasks);
};

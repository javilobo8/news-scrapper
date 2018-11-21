const models = require('./models');

const TARGETS = [
  {
    name: 'Darkumbra v1',
    scrapperName: 'darkumbra',
    description: 'Switch content games',
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
    name: 'PreDB v1',
    scrapperName: 'predb',
    description: 'Switch releases list page',
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
      startOnCreate: true,
      cron: '* * * * *',
      targets: [...targetIds],
      emails: ['test@test.com'],
    },
  ];

  await models.Task.create(tasks);
};

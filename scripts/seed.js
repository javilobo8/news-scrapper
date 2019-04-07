/* eslint-disable */
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

db.targets.remove({});
db.tasks.remove({});
db.entries.remove({});

db.targets.insert(TARGETS);

const targets = db.targets.find({}).toArray();

const task1Ids = targets.map((t) => t._id);

const tasks = [
  {
    name: 'TASK #1',
    description: 'Test task number 1',
    active: true,
    startOnCreate: true,
    cron: '* * * * *',
    targets: [...task1Ids],
    emails: ['test@test.com'],
  },
  {
    name: 'TASK #2',
    description: 'Test task number 2',
    active: false,
    startOnCreate: false,
    cron: '* * * * *',
    targets: [],
    emails: ['test@test.com'],
  },
];

db.tasks.insert(tasks);

# news-scrapper

[![build](https://travis-ci.org/javilobo8/news-scrapper.svg?branch=master)](https://travis-ci.org/javilobo8/news-scrapper)

Application for save/send posts from scrapping webs. Useful for news, forums, lists...

## TODO
* Retreive from Reddit with API? - DONE
* Add express for consume from some client. - DONE
* Error handling. - DONE
* Implement `maxRetries` client option.
* Tests.

## Targets

Each webpage

```javascript
const targetWithAxios = {
  name: 'Reddit - SwitchHaxing/New', // Name
  scrapperName: 'reddit-api', // Scrapper name (in this case src/scrappers/reddit-api.scrapper.js)
  description: 'Reddit SwitchHaxing New posts', // Description
  tags: ['switch'], // Some optional tags
  http: {
    client: 'axios', // Could be axios or puppeteer
    clientOptions: {
      maxRetries: undefined, // Defaults to 0 (only axios)
      timeout: undefined, // TBI
      waitPageLoad: undefined, // Defaults to 0 (only puppeteer)
    },
    host: 'https://www.reddit.com', // Host
    path: '/r/SwitchHaxing/new.json', // Path
    method: 'get', // Method
    params: { // Query Params
      search: 'optional',
    }
  },
};

const targetWithPuppeteer =   {
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
};
```

## Tasks

```javascript
const taskExample = {
  name: 'TASK #1',
  description: 'Test task number 1',
  active: true, // Enable or disable task
  startOnCreate: true, // Start when application starts (depends on active)
  cron: '* * * * *', // Cron-based syntax
  targets: [], // TargetIds
  emails: ['test@test.com'], // Email to send something TBI
}
```
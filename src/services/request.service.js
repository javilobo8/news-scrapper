const axios = require('axios');
const puppeteer = require('puppeteer');
const qs = require('qs');
const url = require('url');

const logger = require('../utils/logger');

class RequestService {
  constructor({ models }) {
    this.models = models;

    this.log = logger(this.constructor.name);
  }

  async call(http) {
    switch (http.client) {
      case this.models.Target.httpClients.AXIOS:
        return this._getWithAxios(http);
      case this.models.Target.httpClients.PUPPETEER:
        return this._getWithPuppeter(http);
      default:
        throw new Error('Calling with no http.client');
    }
  }

  async _getWithAxios(http) {
    const params = http.params ? `?${qs.stringify(http.params)}` : '';
    const requestUrl = url.resolve(http.host, http.path);

    let requests = 0;

    const request = async () => {
      this.log(`Requesting with axios ${http.method} ${url.resolve(requestUrl, params)}`);
      const before = Date.now();

      let response;

      try {
        response = await axios({
          url: requestUrl,
          method: http.method,
          params: http.params,
          body: http.body,
          timeout: http.clientOptions.timeout,
        });
      } catch (err) {
        this.log.warn(`WARNING ${http.method} ${http.host}${http.path} KO! (${Date.now() - before}ms)`);
        requests++;
        if (requests < (http.clientOptions.maxRetries || 0)) {
          this.log.warn(`Retrying ${http.method} ${http.host}${http.path}`);
          return request();
        }
        this.log.error(`ERROR ${http.method} ${http.host}${http.path} KO! (${Date.now() - before}ms)`);
        throw err;
      }

      this.log(`Responsed ${http.method} ${http.host}${http.path} OK! (${Date.now() - before}ms)`);
      return response.data;
    };

    return request();
  }

  async _getWithPuppeter(http) {
    const params = http.params ? `?${qs.stringify(http.params)}` : '';
    const requestUrl = url.resolve(url.resolve(http.host, http.path), params);

    this.log(`Requesting with puppeteer ${http.method} ${requestUrl}`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const before = Date.now();
    await page.goto(requestUrl);
    this.log(`Responsed ${http.method} ${requestUrl} OK! (${Date.now() - before}ms)`);

    const waitPageLoad = (http.clientOptions.waitPageLoad || 0);
    if (waitPageLoad) {
      this.log(`Waiting for ${waitPageLoad}ms ${http.method} ${requestUrl}`);
      await page.waitFor(waitPageLoad);
    }

    const html = await page.content();
    await browser.close();

    return html;
  }
}

module.exports = RequestService;

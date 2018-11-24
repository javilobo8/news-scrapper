const cheerio = require('cheerio');

const DEFAULT_URL = 'http://nswdb.com/';

module.exports = (html) => {
  if (!html || typeof html !== 'string') {
    throw new Error('No html passed');
  }

  const $ = cheerio.load(html);
  const entries = [];

  const releasesTbody = $('table#releases > tbody');

  releasesTbody.children('tr').each((index, element) => {
    const entry = {
      entryId: undefined,
      title: undefined,
      subtitle: undefined,
      url: undefined,
      targetId: undefined,
    };

    const tds = $(element).children('td');

    const idRow = $(tds.get(0));
    const nameRow = $(tds.get(1));
    const releaseName = $(tds.get(11));

    entry.entryId = String(idRow.text()).trim();
    entry.title = String(nameRow.text()).trim();
    entry.subtitle = String(releaseName.text()).trim();
    entry.url = DEFAULT_URL;

    entries.push(entry);
  });

  return entries;
};

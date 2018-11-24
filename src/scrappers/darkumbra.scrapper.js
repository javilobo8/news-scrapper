const cheerio = require('cheerio');

// https://darkumbra.net/forums/forum/195-switch-games/?sortby=start_date&sortdirection=desc

const OL_QUERY = [
  'ol.ipsDataList',
].join('>');

const A_QUERY = [
  'div.ipsDataItem_main',
  'h4.ipsDataItem_title',
  'span.ipsType_break',
  'a',
].join('>');

module.exports = (html) => {
  if (!html || typeof html !== 'string') {
    throw new Error('No html passed');
  }

  const $ = cheerio.load(html);
  const entries = [];

  const ol = $(OL_QUERY);

  ol.children().each((index, liElement) => {
    const entry = {
      entryId: undefined,
      title: undefined,
      subtitle: undefined,
      url: undefined,
      targetId: undefined,
    };

    const li = $(liElement);

    const dataRowId = li.attr('data-rowid');

    if (!dataRowId) {
      return;
    }

    const a = li.find(A_QUERY);

    entry.entryId = dataRowId;
    entry.title = String(a.text()).trim();
    entry.url = a.attr('href');

    entries.push(entry);
  });

  return entries;
};

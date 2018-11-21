const cheerio = require('cheerio');

module.exports = (html) => {
  if (!html || typeof html !== 'string') {
    throw new Error('No html passed');
  }

  const $ = cheerio.load(html);
  const entries = [];

  const plBody = $('div.pl-body');

  plBody.children('div').each((index, element) => {
    const entry = {
      entryId: undefined,
      title: undefined,
      subtitle: undefined,
      url: undefined,
      targetId: undefined,
    };

    const post = $(element);

    const a = post.find('div.p-head > div.p-c-title > h2 > a.p-title');

    entry.entryId = post.attr('id');
    entry.title = String(a.text()).trim();
    entry.url = a.attr('href');

    entries.push(entry);
  });

  return entries;
};

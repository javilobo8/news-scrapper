const DEFAULT_URL = 'https://www.reddit.com';

// Not a scrapper, just an api consumer :D

module.exports = (redditBody) => {
  if (!redditBody || typeof redditBody !== 'object') {
    console.error('redditBody =>', redditBody);
    throw new Error('Wrong redditBody passed');
  }

  const entries = [];

  redditBody.data.children.forEach((redditEntry) => {
    const entry = {
      entryId: undefined,
      title: undefined,
      subtitle: undefined,
      url: undefined,
      targetId: undefined,
    };

    entry.entryId = `${redditEntry.data.subreddit_id}/${redditEntry.data.id}`;
    entry.title = redditEntry.data.title;
    entry.subtitle = redditEntry.data.selftext || redditEntry.data.url;
    entry.url = `${DEFAULT_URL}${redditEntry.data.permalink}`;

    entries.push(entry);
  });

  return entries;
};

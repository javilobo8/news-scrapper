const _ = require('lodash');
const logger = require('../utils/logger');

class EntryService {
  constructor({ models }) {
    this.EntryModel = models.Entry;

    this.log = logger(this.constructor.name);
  }

  createMany(newEntries) {
    this.log(`Inserting ${newEntries.length} entries`);
    return this.EntryModel.create(newEntries);
  }

  getById(id) {
    return this.EntryModel.findById(id);
  }

  getByEntryIdAndTargetId(entryId, targetId) {
    return this.EntryModel.findOne({ entryId, targetId });
  }

  getByTargetId(targetId) {
    return this.EntryModel.find({ targetId });
  }

  /**
   * Get Ids filtering other ones.
   *
   * @param {String[]} entriesIds
   * @param {ObjectId} targetId
   */
  async filterNonExistentIds(entriesIds, targetId) {
    const query = { entryId: { $in: entriesIds }, targetId };
    const projection = { entryId: 1 };

    const results = await this.EntryModel.find(query, projection);
    const oldEntriesIds = results.map((entry) => entry.entryId);

    return _.difference(entriesIds, oldEntriesIds);
  }
}

module.exports = EntryService;

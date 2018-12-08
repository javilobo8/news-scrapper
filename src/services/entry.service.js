const ldDifference = require('lodash/difference');
const logger = require('../utils/logger');

class EntryService {
  constructor({ models }) {
    this.EntryModel = models.Entry;

    this.log = logger(this.constructor.name);
  }

  /**
   * Get all Entries
   */
  get(params = {}) {
    return this.EntryModel.find(params).exec();
  }

  /**
   * Creates new Entries
   *
   * @param {Entry[]} newEntries
   * @returns {Promise<>}
   */
  createMany(newEntries) {
    this.log(`Inserting ${newEntries.length} entries`);
    return this.EntryModel.create(newEntries);
  }

  /**
   * Get an entry by document id
   *
   * @param {string|ObjectId} id
   * @returns {Promise<EntryModel>}
   */
  getById(id) {
    return this.EntryModel.findById(id);
  }

  /**
   * Get an entry by entryId and targetId
   *
   * @param {string} entryId
   * @param {string|ObjectId} targetId
   * @returns {Promise<EntryModel>}
   */
  getByEntryIdAndTargetId(entryId, targetId) {
    return this.EntryModel.findOne({ entryId, targetId });
  }

  /**
   * Get an entries by targetId
   *
   * @param {string|ObjectId} targetId
   * @returns {Promise<EntryModel>}
   */
  getByTargetId(targetId) {
    return this.EntryModel.find({ targetId });
  }

  /**
   * Get Ids filtering other ones.
   *
   * @param {string[]} entriesIds
   * @param {string|ObjectId} targetId
   */
  async filterNonExistentIds(entriesIds, targetId) {
    const query = { entryId: { $in: entriesIds }, targetId };
    const projection = { entryId: 1 };

    const results = await this.EntryModel.find(query, projection);
    const oldEntriesIds = results.map((entry) => entry.entryId);

    return ldDifference(entriesIds, oldEntriesIds);
  }
}

module.exports = EntryService;

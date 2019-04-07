const { expect } = require('chai');

const EntryService = require('./entry.service');
const models = require('../models');
const testDB = require('../../test/test-db');

const {
  Entry: EntryModel,
} = models;

describe('EntryService', () => {
  const entryService = new EntryService({ models });

  before(() => testDB.connect());
  after(() => testDB.disconnect());

  describe('get', () => {
    describe('when it runs', () => {
      const targetId = new models.mongoose.Types.ObjectId();
      const newEntries = [
        {
          entryId: 'aabbccdd-1',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId,
        },
        {
          entryId: 'aabbccdd-2',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId,
        },
      ];

      before(() => EntryModel.create(newEntries));
      after(() => EntryModel.deleteMany());

      it('should return entries', async () => {
        const result = await entryService.get();

        expect(result).to.have.lengthOf(2);
      });
    });
  });

  describe('createMany', () => {
    describe('when it runs', () => {
      const newEntries = [
        {
          entryId: 'aabbccdd-1',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId: new models.mongoose.Types.ObjectId(),
        },
        {
          entryId: 'aabbccdd-2',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId: new models.mongoose.Types.ObjectId(),
        },
      ];

      after(() => EntryModel.deleteMany());

      it('should add new entries', async () => {
        await entryService.createMany(newEntries);
        const result = await EntryModel.find();

        expect(result).to.have.lengthOf(2);
      });
    });
  });

  describe('getById', () => {
    describe('when it runs', () => {
      const entryDocId = new models.mongoose.Types.ObjectId();
      const baseEntry = {
        _id: entryDocId,
        entryId: 'aabbccdd',
        title: 'test-title',
        subtitle: 'test-subtitle',
        url: 'http://test.url',
        targetId: new models.mongoose.Types.ObjectId(),
      };

      before(() => new EntryModel(baseEntry).save());
      after(() => EntryModel.deleteMany());

      it('should return the correct entry', async () => {
        const result = await entryService.getById(entryDocId);

        expect(result.entryId).to.be.equal(baseEntry.entryId);
        expect(result.title).to.be.equal(baseEntry.title);
        expect(result.subtitle).to.be.equal(baseEntry.subtitle);
        expect(result.url).to.be.equal(baseEntry.url);
        expect(result.targetId).to.be.eql(baseEntry.targetId);
      });
    });
  });

  describe('getByEntryIdAndTargetId', () => {
    describe('when it runs', () => {
      const targetId = new models.mongoose.Types.ObjectId();
      const entryId = 'aaabbbccc';
      const baseEntry = {
        entryId,
        title: 'test-title',
        subtitle: 'test-subtitle',
        url: 'http://test.url',
        targetId,
      };

      before(() => new EntryModel(baseEntry).save());
      after(() => EntryModel.deleteMany());

      it('should return the correct entry', async () => {
        const result = await entryService.getByEntryIdAndTargetId(entryId, String(targetId));

        expect(result.entryId).to.be.equal(baseEntry.entryId);
        expect(result.title).to.be.equal(baseEntry.title);
        expect(result.subtitle).to.be.equal(baseEntry.subtitle);
        expect(result.url).to.be.equal(baseEntry.url);
        expect(result.targetId).to.be.eql(baseEntry.targetId);
      });
    });
  });

  describe('getByTargetId', () => {
    describe('when it runs', () => {
      const targetId = new models.mongoose.Types.ObjectId();
      const newEntries = [
        {
          entryId: 'aabbccdd-1',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId,
        },
        {
          entryId: 'aabbccdd-2',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId,
        },
      ];

      before(() => EntryModel.create(newEntries));
      after(() => EntryModel.deleteMany());

      it('should return filtered entries', async () => {
        const result = await entryService.getByTargetId(String(targetId));

        expect(result).to.have.lengthOf(2);
      });
    });
  });

  describe('filterNonExistentIds', () => {
    describe('when it runs', () => {
      const targetId = new models.mongoose.Types.ObjectId();
      const newEntries = [
        {
          entryId: 'aabbccdd-1',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId,
        },
        {
          entryId: 'aabbccdd-2',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId,
        },
        {
          entryId: 'aabbccdd-3',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId,
        },
        {
          entryId: 'aabbccdd-4',
          title: 'test-title',
          subtitle: 'test-subtitle',
          url: 'http://test.url',
          targetId: new models.mongoose.Types.ObjectId(),
        },
      ];

      before(() => EntryModel.create(newEntries));
      after(() => EntryModel.deleteMany());

      it('should return difference of new and existing ids', async () => {
        const entriesIds = ['new-entry-id', newEntries[1].entryId, newEntries[2].entryId];
        const result = await entryService.filterNonExistentIds(entriesIds, String(targetId));

        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.be.equal('new-entry-id');
      });
    });
  });
});

const EntryService = require('./entry.service');
const models = require('../models');
const prepareDB = require('../../test/prepare-db')(models.mongoose);

describe('EntryService', () => {
  const entryService = new EntryService({ models });

  beforeAll(() => prepareDB.connect());
  afterAll(() => prepareDB.disconnect());

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

      beforeAll(() => models.Entry.create(newEntries));
      afterAll(() => models.Entry.deleteMany());

      it('should return entries', async () => {
        const result = await entryService.get();

        expect(result).toHaveLength(2);
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

      afterAll(() => models.Entry.deleteMany());

      it('should add new entries', async () => {
        await entryService.createMany(newEntries);
        const result = await models.Entry.find();

        expect(result).toHaveLength(2);
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

      beforeAll(() => models.Entry.create(baseEntry));
      afterAll(() => models.Entry.deleteMany());

      it('should return the correct entry', async () => {
        const result = await entryService.getById(entryDocId);

        expect(result).toHaveProperty('entryId', baseEntry.entryId);
        expect(result).toHaveProperty('title', baseEntry.title);
        expect(result).toHaveProperty('subtitle', baseEntry.subtitle);
        expect(result).toHaveProperty('url', baseEntry.url);
        expect(result).toHaveProperty('targetId', baseEntry.targetId);
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

      beforeAll(() => models.Entry.create(baseEntry));
      afterAll(() => models.Entry.deleteMany());

      it('should return the correct entry', async () => {
        const result = await entryService.getByEntryIdAndTargetId(entryId, String(targetId));

        expect(result).toHaveProperty('entryId', baseEntry.entryId);
        expect(result).toHaveProperty('title', baseEntry.title);
        expect(result).toHaveProperty('subtitle', baseEntry.subtitle);
        expect(result).toHaveProperty('url', baseEntry.url);
        expect(result).toHaveProperty('targetId', baseEntry.targetId);
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

      beforeAll(() => models.Entry.create(newEntries));
      afterAll(() => models.Entry.deleteMany());

      it('should return filtered entries', async () => {
        const result = await entryService.getByTargetId(String(targetId));

        expect(result).toHaveLength(2);
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

      beforeAll(() => models.Entry.create(newEntries));
      afterAll(() => models.Entry.deleteMany());

      it('should return difference of new and existing ids', async () => {
        const entriesIds = ['new-entry-id', newEntries[1].entryId, newEntries[2].entryId];
        const result = await entryService.filterNonExistentIds(entriesIds, String(targetId));

        expect(result).toHaveLength(1);
        expect(result[0]).toBe('new-entry-id');
      });
    });
  });
});

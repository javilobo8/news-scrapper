const supertest = require('supertest');

const models = require('../models');
const prepareDB = require('../../test/prepare-db')(models.mongoose);
const app = require('../index');

describe('EntryController', () => {
  beforeAll(() => prepareDB.connect());

  afterAll(() => prepareDB.disconnect());

  describe('GET /entry', () => {
    describe('without params', () => {
      const entries = [
        {
          entryId: 'entry-entryId-1',
          title: 'entry-title-1',
          subtitle: 'entry-subtitle-1',
          url: 'entry-url-1',
          targetId: new models.mongoose.Types.ObjectId(),
        },
        {
          entryId: 'entry-entryId-2',
          title: 'entry-title-2',
          subtitle: 'entry-subtitle-2',
          url: 'entry-url-2',
          targetId: new models.mongoose.Types.ObjectId(),
        },
      ];

      let response;

      beforeAll(async () => {
        await models.Entry.insertMany(entries);

        return supertest(app)
          .get('/entry')
          .then((_response) => {
            response = _response;
          });
      });

      afterAll(() => models.Entry.deleteMany());

      it('should return 200 statusCode', () => {
        expect(response).toHaveProperty('statusCode', 200);
      });

      it('should return all entries', () => {
        expect(response.body).toHaveLength(2);
      });
    });

    describe('with valid params', () => {
      const targetId = new models.mongoose.Types.ObjectId();
      const entries = [
        {
          entryId: 'entry-entryId-1',
          title: 'entry-title-1',
          subtitle: 'entry-subtitle-1',
          url: 'entry-url-1',
          targetId,
        },
        {
          entryId: 'entry-entryId-2',
          title: 'entry-title-2',
          subtitle: 'entry-subtitle-2',
          url: 'entry-url-2',
          targetId: new models.mongoose.Types.ObjectId(),
        },
      ];

      let response;

      beforeAll(async () => {
        await models.Entry.insertMany(entries);

        return supertest(app)
          .get(`/entry?targetId=${targetId}`)
          .then((_response) => {
            response = _response;
          });
      });

      afterAll(() => models.Entry.deleteMany());

      it('should return 200 statusCode', () => {
        expect(response).toHaveProperty('statusCode', 200);
      });

      it('should return filtered entries', () => {
        expect(response.body).toHaveLength(1);
      });
    });

    describe('with invalid params', () => {
      let response;

      beforeAll(() => {
        return supertest(app)
          .get(`/entry?targetId=${1234}`)
          .then((_response) => {
            response = _response;
          });
      });

      afterAll(() => models.Entry.deleteMany());

      it('should return 500 statusCode', () => {
        expect(response).toHaveProperty('statusCode', 500);
      });

      it('should return error on body', () => {
        expect(response.body).toHaveProperty('statusCode', 500);
      });
    });
  });
});

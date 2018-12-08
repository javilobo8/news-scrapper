const { isMongoObjectId, exists } = require('./validations');

/**
 * @param {array} validators
 * @param {any} value
 */
function validate(validators, value) {
  if (!exists(value)) {
    return undefined;
  }

  if (!validators.every((validator) => validator(value))) {
    throw new Error('Invalid params');
  }

  return value;
}

module.exports = {
  getEntries(req) {
    const {
      targetId,
    } = req.query;

    const params = {};

    if (validate([isMongoObjectId], targetId)) {
      params.targetId = targetId;
    }

    return params;
  },
};

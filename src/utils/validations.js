const mongoose = require('mongoose');
const ldIsNil = require('lodash/isNil');

/**
 * @param {any} value
 * @returns {boolean}
 */
function exists(value) {
  return !ldIsNil(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isMongoObjectId(input) {
  return mongoose.Types.ObjectId.isValid(input);
}

module.exports = {
  exists,
  isMongoObjectId,
};

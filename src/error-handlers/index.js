const Boom = require('boom');

function sendError(res) {
  return (error) => {
    console.error(error);
    res.send(Boom.internal().output.payload);
  };
}

module.exports = {
  sendError,
};

const Boom = require('boom');

function sendError(res) {
  return (error) => {
    console.error(error);
    const boom = Boom.internal();
    res.status(boom.output.statusCode).send(boom.output.payload);
  };
}

module.exports = {
  sendError,
};

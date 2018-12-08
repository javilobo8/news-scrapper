module.exports = {
  port: 8080,
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/web-bot',
  },
};

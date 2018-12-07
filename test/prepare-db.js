module.exports = (mongoose) => ({
  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.on('error', reject);

      mongoose.connect(global.__MONGOMS_URI__, { useNewUrlParser: true });
    });
  },

  disconnect() {
    return mongoose.disconnect();
  },
});

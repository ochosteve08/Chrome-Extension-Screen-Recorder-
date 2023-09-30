const { connectToMongoDb } = require('./mongodb.config');
const environmentVariables = require('./env');

module.exports = {
  connectToMongoDb,
  environmentVariables,
};

const remote = require('./remote');
const config = require('../config');

module.exports = new remote(config.persistentDB.host, config.persistentDB.port);

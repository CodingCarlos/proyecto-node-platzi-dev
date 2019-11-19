const remote = require('./remote');
const config = require('../config');

//

module.exports = new remote(config.cacheDB.host, config.cacheDB.port);

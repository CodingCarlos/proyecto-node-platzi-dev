const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	port: process.env.PORT || 3000,
	logLevel: process.env.LOG_LEVEL || 'debug',
	jwt: {
		secret: process.env.JWT_SECRET || 'notasecret',
		issuer: process.env.JWT_ISSUER || 'issuer',
		required: process.env.JWT_REQUIRED || false,
	},
	mysql: {
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USER || '',
		password: process.env.MYSQL_PASS || '',
		database: process.env.MYSQL_DB || '',
		port: process.env.MYSQL_PORT || 3306,
	},
	persistentDB: {
		host: process.env.PERSISTENT_HOST || 'localhost',
		port: process.env.PERSISTENT_PORT || '3001',
	},
	cacheDB: {
		host: process.env.CACHE_HOST || 'localhost',
		port: process.env.CACHE_PORT || '3002',
	},
}
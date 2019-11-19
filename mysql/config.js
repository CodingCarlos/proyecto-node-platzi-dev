const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	port: process.env.PORT || 3001,
	logLevel: process.env.LOG_LEVEL || 'debug',
	mysql: {
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USER || '',
		password: process.env.MYSQL_PASS || '',
		database: process.env.MYSQL_DB || '',
		port: process.env.MYSQL_PORT || 3306,
	},
}
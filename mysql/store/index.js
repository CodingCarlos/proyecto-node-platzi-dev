// MySql Connection
const mysql = require('mysql');

const config = require('../config');

const connection = mysql.createConnection({
	host: config.mysql.host,
	user: config.mysql.user,
	password: config.mysql.password,
	database: config.mysql.database,
});
connection.connect();
 
 
function list(table) {
	return new Promise((resolve, reject) => {
		
		connection.query(`SELECT * FROM ${table}`, function (error, results, fields) {
			if (error) return reject(error);
			
			console.log(results);

			//console.log('The solution is: ', results[0].solution);
			resolve(results);
		});

		//connection.end();
	});
}

module.exports = {
	list,
};
 
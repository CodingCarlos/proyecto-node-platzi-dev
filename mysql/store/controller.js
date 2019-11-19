// MySql Connection
const mysql = require('mysql');

const config = require('../config');

const db_config = {
	host: config.mysql.host,
	user: config.mysql.user,
	password: config.mysql.password,
	database: config.mysql.database,
};
let connection;

function handleConnection() {
	connection = mysql.createConnection(db_config);

	connection.connect(function(err) {
		if(err) {
			console.error('error when connecting to db:', err);
			// We introduce a delay before attempting to reconnect,
			// to avoid a hot loop, and to allow our node script to
			// process asynchronous requests in the meantime.
			setTimeout(handleConnection, 2000); 
		}                                     
	});                                     

	connection.on('error', function(err) {
		console.error('db error', err);
		// Connection to the MySQL server is usually
		// lost due to either server restart, or a
		// connnection idle timeout (the wait_timeout
		// server variable configures this)
		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleConnection();
		} else {
			throw err;
		}
	});
}
handleConnection();
 
 
function list(table) {
	return new Promise((resolve, reject) => {
		connection.query(`SELECT * FROM ${table}`, function (error, results, fields) {
			if (error) return reject(error);
			resolve(results);
		});
	});
}

function get(table, id) {
	return new Promise((resolve, reject) => {
		connection.query(`SELECT * FROM ${table} WHERE id='${id}'`, function (error, results, fields) {
			if (error) return reject(error);
			resolve(results[0] || null);
		});
	});
}

function insert(table, data) {
	return new Promise((resolve, reject) => {
		connection.query(`INSERT INTO ${table} SET ?`, data, function (error, results, fields) {
			if (error) return reject(error);
			resolve(results);
		});
	});
}

function update(table, data) {
	return new Promise((resolve, reject) => {
		const id = data.id;
		const updateData = { ...data };
		updateData.id = undefined;

		connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id], function (error, results, fields) {
			if (error) return reject(error);
			resolve(results);
		});
	});
}

async function upsert(table, data) {
	if (!data.id) {
		return insert(table, data);
	}

	const user = await get(table, data.id);
	if (!user) {
		return insert(table, data);
	}

	return update(table, data);
}

async function query(table, query, join) {
	return new Promise((resolve, reject) => {
		let j = join;
		let joinQuery = '';
		
		// Allow join as a string, and convert it to object
		if (join && typeof join === 'string') {
			j = {};
			j[join] = join;
		}

		if (join) {
			const key = Object.keys(j)[0];
			const val = j[key];
			joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`;
		}

		connection.query(`SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`, query, function (error, results, fields) {
			if (error) return reject(error);
			resolve(results[0] || null);
		});
	});
}

module.exports = {
	list,
	get,
	insert,
	update,
	upsert,
	query,
	// remove,
};
 
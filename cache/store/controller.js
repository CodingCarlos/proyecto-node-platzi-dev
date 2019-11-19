// Redis connection
const redis = require('redis');

const config = require('../config');

const Redis = redis.createClient(config.redis.port, config.redis.host);

Redis.auth(config.redis.password);
Redis.on('connect', function() {
	console.log('Redis connected');
});

// ToDo: Set redis funcionality
function list(resource) {}
function get(resource, id) {}
function insert(resource, data) {}
function update(resource, data) {}
function upsert(resource, data) {}

async function query(resource, query) {
	return 'Query not implemented';
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

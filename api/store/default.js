// const db = {};
const db = {
	user: [ { id: '123', name: 'paco' } ],
};

async function list(collection) {
	return db[collection] || [];
}

async function get(collection, id) {
	const col = await list(collection);
	return col.filter(item => item.id === id)[0] || null;
}

async function insert(collection, data) {
	if (!db[collection]) {
		db[collection] = [];
	}
	return db[collection].push(data);
}

async function update() {
	return true;
}

async function upsert() {
	return true;
}

async function remove() {
	return true;
}

module.exports = {
	list,
	get,
	insert,
	update,
	upsert,
	remove,
}
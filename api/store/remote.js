const request = require('request');

function createRemoteDb(host, port) {
	const URI = 'http://'+ host +':'+ port;

	function list(table) {
		return req('GET', table);
	}

	function get(table, id) {
		return req('GET', table, id);
	}

	function insert(table, data) {
		return req('POST', table, data);
	}

	function update(table, data) {
		return req('PUT', table, data);
	}

	function upsert(table, data) {
		if (data.id) {
			return update(table, data);
		}

		return insert(table, data);
	}

	function query(table, query, join) {
		return req('POST', table + '/query', { query, join });
	}

	//

	function req(method, table, data) {
		let url = URI +'/'+ table;
		let body = '';

		if (method === 'GET' && data) {
			url += '/'+ data;
		} else if (data) {
			body = JSON.stringify(data);
		}

		return new Promise((resolve, reject) => {
			request({
				method: method,
			// request.post({
				headers: {'content-type' : 'application/json'},
			  	url: url,
			  	body: body,
			}, (err, req, body) => {
				if (err) {
					console.error('Error sending data to db...');
					console.error(err);
					return reject(err.message);
				}

				const resp = JSON.parse(body);
				console.log('Success!', resp);

				return resolve(resp.body);
			});
		});
	}

	return {
		list,
		get,
		insert,
		update,
		upsert,
		query,
		// remove,
	};
}

module.exports = createRemoteDb;

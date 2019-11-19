const utils = require('../../utils');
const auth = require('../../auth');

const COLLECTION = 'auth';

module.exports = function (injectedStore) {
	let Store = injectedStore;
	if (!Store) {
		Store = require('../../store/default');
	}

	async function login(username, pass) {
		const data = await Store.query(COLLECTION, { username: username });
		if (!data) {
			// throw utils.err('No existe el usuario', 404);
			// Por seguridad, damos poca información de qué ha fallado
			throw utils.err('Información inválida', 400);
		} else if (data && data.password !== pass) {
			throw utils.err('Información inválida', 400);
		}

		const token = await auth.sign({ sub: data.id });

		return token;
	}

	async function upsert(data) {
		// TO_DO:
		// VERIFY FIELDS!!
		const authData = {
			id: data.id
		};

		if (data.username) {
			authData.username = data.username;
		}
		if (data.password) {
			authData.password = data.password;
		}

		return Store.upsert(COLLECTION, authData);
	}


	return {
		login,
		upsert,
	}
}

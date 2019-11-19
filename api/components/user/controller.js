const nanoid = require('nanoid');

const utils = require('../../utils');
const auth = require('../auth');
// const dbUtils = require('../../store/utils');

const COLLECTION = 'user';

module.exports = function (injectedStore) {
	let Store = injectedStore;
	if (!Store) {
		Store = require('../../store/default');
	}

	function list(query) {
		// ToDo: Parse query
		// return Store.list(COLLECTION, dbUtils.query(query));
		return Store.list(COLLECTION);
	}

	async function get(id) {
		const user = await Store.get(COLLECTION, id);
		if (!user) {
			throw utils.err('No existe el usuario', 404);
		}

		return user;
	}

	async function upsert(data) {
		// TO_DO:
		// VERIFY FIELDS!!
		const user = {
			id: data.id,
			username: data.username,
			pic: data.pic
		}

		if (!user.id) {
			// New user
			if (!data.password) {
				throw utils.err('El usuario no tiene password', 400);
			}
			user.id = nanoid();
		}

		// If password, update auth details
		if (data.password || data.username) {
			await auth.upsert({
				id: user.id,
				username: user.username,
				password: data.password,
			});
		}

		return Store.upsert(COLLECTION, user).then(() => user);
	}

	async function follow(follower, followed) {
		try  {
			const result = await Store.upsert(COLLECTION + '_follow', {
				user_from: follower,
				user_to: followed,
			});
		} catch(e) {
			if (e.code = 'ER_NO_REFERENCED_ROW') {
				e.message = 'Invalid user to folow';
				e.statusCode = 400;
			}
			throw e;
		}

		return true;
	}

	async function following(user) {
		const join = {}
		join[COLLECTION] = 'user_from';
		console.log(join);
		const users = await Store.query(COLLECTION + '_follow', { user_from: user }, join);
		return users;
	}


	return {
		list,
		get,
		upsert,
		follow,
		following,
	}
}

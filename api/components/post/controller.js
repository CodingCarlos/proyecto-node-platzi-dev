const nanoid = require('nanoid');

const utils = require('../../utils');

const COLLECTION = 'post';

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
			throw utils.err('No existe el post', 404);
		}

		return user;
	}

	async function upsert(data, user) {
		// TO_DO:
		// VERIFY FIELDS!!
		const post = {
			id: data.id,
			user: user,
			text: data.text,
			updated: new Date(),
		}

		console.log(post);

		if (!post.id) {
			post.id = nanoid();
			post.created = new Date();
		}

		return Store.upsert(COLLECTION, post).then(() => post);
	}

	async function like(post, user) {
		try  {
			const like = await Store.upsert(COLLECTION + '_like', {
				post: post,
				user: user,
				date: new Date(),
			});

			return like;
		} catch(e) {
			if (e.code = '	ER_NO_REFERENCED_ROW') {
				e.message = 'Invalid data provided';
				e.statusCode = 400;
			}
			throw e;
		}
	}

	async function postsLiked(user) {
		const users = await Store.query(COLLECTION + '_like', { user: user }, 'post');
		return users;
	}

	async function postLikers(post) {
		const users = await Store.query(COLLECTION + '_like', { post: post }, 'user');
		return users;
	}


	return {
		list,
		get,
		upsert,
		like,
		postsLiked,
		postLikers,
	}
}

const auth = require('../../auth');
const Controller = require('./index');
const { err } = require('../../utils');

function checkAuth(action, options) {
	async function middleware(req, res, next) {
		try {
			switch(action) {
				case 'list':
				case 'get':
					auth.check.public(req);
					break;
					
				case 'add':
				case 'list_own':
					auth.check.user(req);
					break;

				case 'update':
					const post = await Controller.get(req.body.id);
					auth.check.own(req, post.user);
					break;

				case 'delete':
					auth.check.	admin(req);
					break;

				default:
					auth.check.default(req);
			}

			next();
		} catch (e) {
			throw err(e.message, 401);
		}
	}

	return middleware
}

module.exports = checkAuth;

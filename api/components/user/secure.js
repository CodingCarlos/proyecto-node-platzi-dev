const auth = require('../../auth');
const { err } = require('../../utils');

function checkAuth(action, options) {
	function middleware(req, res, next) {
		let owner = null;
		if (options && options.owner) {
			owner = req.params[options.owner] || req.body[options.owner];
			console.log('[secure] owner is', owner)
		}
		
		try {
			switch(action) {
				case 'list':
				case 'get':
				case 'add':
					auth.check.public(req);
					break;
					
				case 'update':
					auth.check.own(req, owner);
					break;

				case 'delete':
					auth.check.admin(req);
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

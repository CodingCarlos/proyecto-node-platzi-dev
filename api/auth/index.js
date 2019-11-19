const jwt = require('jsonwebtoken');

const config = require('../config');

function sign(data) {
	return jwt.sign(data, config.jwt.secret);
}

function verify(token) {
	return jwt.verify(token, config.jwt.secret);
}

const check = {
	public: function (req) {
		try {
			decodeHeader(req);
		} catch(e) {
			console.log('[auth] Public request with invalid JWT', e);
		}
		return true;
	},
	user: function (req, owner) {
		decodeHeader(req);
	},
	own: function (req, owner) {
		const decoded = decodeHeader(req);

		if (decoded.sub !== owner) {
			throw new Error('Not allowed')
		}
	},
	admin: function (req) {
		const decoded = decodeHeader(req);

		if (decoded.role !== 'admin') {
			throw new Error('Not allowed')
		}
	},
}

function decodeHeader(req) {
	const authorization = req.headers.authorization || null;
	const token = getToken(authorization);
	const decoded = verify(token);

	// Set decoded token into request header
	req.user = decoded;

	return decoded
}

function getToken(header) {
	if (!header) {
		throw new Error('Empty Authorization header');
	} else if (header.indexOf('Bearer') === -1) {
		throw new Error('Invalid Authorization header: "Bearer" not found');
	}

	return header.split(' ')[1] || null;
}


module.exports = {
	sign,
	check,
};
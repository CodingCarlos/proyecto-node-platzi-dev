const response = require('./response').error;

function errors(err, req, res, next) {
	console.error('[error]', err);
	response(req, res, err.message, err.statusCode)
}

module.exports = errors;
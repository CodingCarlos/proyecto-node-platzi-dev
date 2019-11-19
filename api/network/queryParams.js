function urlOptions(req, relations) {
	return options = {
		skip: req.query.skip,
		limit: req.query.limit,
		orderBy: req.query.orderBy,
		query: req.query.q,
		active: req.activeOnly,
	};
}

module.exports = urlOptions;
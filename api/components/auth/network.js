const express = require('express');
const response = require('../../network/response');
const Controller = require('./index');

const router = express.Router();

router.post('/login', login);

function login(req, res, next) {
	return Controller.login(req.body.username, req.body.password)
		.then( (data) => {
			return response.success(req, res, data, 200);
		})
		.catch(next);
}


module.exports = router;

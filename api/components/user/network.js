const express = require('express');
// const logger = require('../../utils/logger');
const upload = require('../../utils/upload');
const response = require('../../network/response');
// const queryParams = require('../../network/queryParams');
const auth = require('./secure');
const Controller = require('./index');

const router = express.Router();

router.get('/', auth('list'), list);
router.get('/:id', auth('get'), get);
router.post('/', auth('add'), upload('pic'), upsert);
router.put('/', auth('update', { owner: 'id' }), upload('pic'), upsert);
router.post('/follow/:user', auth('add'), follow);
router.get('/following', auth('list'), following);
router.get('/:id/following', auth('list'), following);
router.get('/followers', auth('list'), followers);
router.get('/:id/followers', auth('list'), followers);

function list(req, res, next) {
	// return Controller.list(queryParams(req))
	return Controller.list()
		.then( (data) => {
			return response.success(req, res, data, 200);
		})
		.catch(next);
}

function get(req, res, next) {
	return Controller.get(req.params.id)
		.then( (data) => {
			return response.success(req, res, data, 200);
		})
		.catch(next);
}

function add(req, res, next) {
	// Avoid set id hack. Other option would be throw an Error.
	req.body.id = undefined;
	upsert(req, res, next);
}

function upsert(req, res, next) {
	let data = req.body;
	if (req.file && req.file.path) {
		// File uploaded. Set it to the right field
		data.pic = req.file.path;
	}
	
	return Controller.upsert(data)
		.then( (data) => {
			return response.success(req, res, data, 201);
		})
		.catch(next);
}

function follow(req, res, next) {
	return Controller.follow(req.user.sub, req.params.user)
		.then( (data) => {
			return response.success(req, res, data, 201);
		})
		.catch(next);
}

function following(req, res, next) {
	let user = req.params.id || req.user.sub;
	return Controller.following(user)
		.then( (data) => {
			return response.success(req, res, data, 200);
		})
		.catch(next);
}

function followers(req, res, next) {
	// return Controller.list(queryParams(req))
	return Controller.list()
		.then( (data) => {
			return response.success(req, res, data, 200);
		})
		.catch(next);
}


module.exports = router;

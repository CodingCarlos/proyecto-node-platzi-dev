const express = require('express');

const response = require('../network/response');
const Controller = require('./controller');

const router = express.Router();

router.get('/:table', list);
router.get('/:table/:id', get);
router.post('/:table', insert);
router.put('/:table', update);
router.post('/:table/query', query);


async function list(req, res, next) {
	console.log('Listando la tabla ', req.params.table);
	Controller.list(req.params.table)
		.then(data => {
			response.success(req, res, data, 200);
		})
		.catch(next);
}

async function get(req, res, next) {
	Controller.get(req.params.table, req.params.id)
		.then(data => {
			response.success(req, res, data, 200);
		})
		.catch(next);
}

async function insert(req, res, next) {
	Controller.insert(req.params.table, req.body)
		.then(data => {
			response.success(req, res, data, 201);
		})
		.catch(next);
}

async function update(req, res, next) {
	Controller.update(req.params.table, req.body)
		.then(data => {
			response.success(req, res, data, 200);
		})
		.catch(next);
}

async function query(req, res, next) {
	Controller.query(req.params.table, req.body.query, req.body.join)
		.then(data => {
			response.success(req, res, data, 200);
		})
		.catch(next);
}



module.exports = router;
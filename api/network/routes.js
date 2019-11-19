const express = require('express');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../swagger.json');

const auth = require('../components/auth/network');
const user = require('../components/user/network');
const post = require('../components/post/network');

const routes = function (server) {
	// Swagger docs routes
	server.use('/api-docs', swaggerUi.serve);
	server.get('/api-docs', swaggerUi.setup(swaggerDocument));

	// API Routes
    server.use('/auth', auth);
    server.use('/user', user);
    server.use('/post', post);
}

module.exports = routes;
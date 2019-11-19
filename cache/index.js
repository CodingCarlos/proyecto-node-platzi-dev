const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config')
const { store } = require('./store');

// Crete app
const app = express();
app.use(bodyParser.json());

// Prepare routes
app.use('/', store);

// Start listening
app.listen(config.port, () => {
	console.info('Server listening on port '+ config.port);
});

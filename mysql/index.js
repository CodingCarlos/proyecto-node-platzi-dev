const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');
const store = require('./store/network');
const errors = require('./network/errors');

app.use(cors());
app.use(bodyParser.json());

// Setup routes
app.use('/', store);

// Prepare errors
app.use(errors);

app.listen(config.port, function () {
    console.log('La base de datos está escuchando en '+ config.host +':' + config.port);
});
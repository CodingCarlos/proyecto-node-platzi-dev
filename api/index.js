const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');
const router = require('./network/routes');
const errors = require('./network/errors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Setup routes
router(app);

// Prepare errors
app.use(errors);

app.listen(config.port, function () {
    console.log('La aplicación está escuchando en '+ config.host +':' + config.port);
});
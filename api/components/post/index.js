// const store = require('../../store/mysql');
const store = require('../../store/persistent');
const ctrl = require('./controller')(store);

module.exports = ctrl;
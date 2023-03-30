const bodyParser = require('body-parser');
const helmet = require('helmet');
const getProfile = require('./getProfile');

module.exports = [helmet(), bodyParser.json(), getProfile];

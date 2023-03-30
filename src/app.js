const express = require('express');
const { db } = require('./configs');
const middlewares = require('./middlewares');
const routes = require('./routes');

const app = express();

app.set('sequelize', db);

app.use(middlewares);
app.use(routes);

module.exports = app;

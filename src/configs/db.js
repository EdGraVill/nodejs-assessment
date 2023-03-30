const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  logging: process.env.NODE_ENV !== 'production',
  storage: './database.sqlite3',
});

module.exports = sequelize;

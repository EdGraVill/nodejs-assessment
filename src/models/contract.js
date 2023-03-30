const Sequelize = require('sequelize');
const { db } = require('../configs');

class Contract extends Sequelize.Model {}
Contract.init(
  {
    status: {
      type: Sequelize.ENUM('new', 'in_progress', 'terminated'),
    },
    terms: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
  },
  {
    modelName: 'Contract',
    sequelize: db,
  },
);

module.exports = Contract;

const Sequelize = require('sequelize');
const { db } = require('../configs');

class Job extends Sequelize.Model {}
Job.init(
  {
    description: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    paid: {
      default: false,
      type: Sequelize.BOOLEAN,
    },
    paymentDate: {
      type: Sequelize.DATE,
    },
    price: {
      allowNull: false,
      type: Sequelize.DECIMAL(12, 2),
    },
  },
  {
    modelName: 'Job',
    sequelize: db,
  },
);

module.exports = Job;

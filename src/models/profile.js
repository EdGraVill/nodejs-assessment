const Sequelize = require('sequelize');
const { db } = require('../configs');

class Profile extends Sequelize.Model {}
Profile.init(
  {
    balance: {
      type: Sequelize.DECIMAL(12, 2),
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    profession: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.ENUM('client', 'contractor'),
    },
  },
  {
    modelName: 'Profile',
    sequelize: db,
  },
);

module.exports = Profile;

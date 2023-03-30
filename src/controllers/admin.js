const { Sequelize, Op } = require('sequelize');
const { Profile, Job, Contract } = require('../models');

async function earnedByProfession(startDate, endDate) {
  return Profile.findAll({
    attributes: ['profession', [Sequelize.fn('sum', Sequelize.col('price')), 'earned']],
    group: ['Profile.profession'],
    include: {
      as: 'Contractor',
      attributes: [],
      include: {
        attributes: [],
        model: Job,
        where: {
          paid: true,
          paymentDate: {
            [Op.and]: [
              {
                [Op.gte]: startDate,
              },
              {
                [Op.lte]: endDate,
              },
            ],
          },
        },
      },
      model: Contract,
    },
    order: [[Sequelize.literal('earned'), 'DESC']],
    where: {
      type: 'contractor',
    },
  });
}

async function totalSpent(startDate, endDate) {
  return Profile.findAll({
    attributes: [
      'id',
      [Sequelize.literal('firstName || " " || lastName'), 'fullName'],
      [Sequelize.fn('sum', Sequelize.col('price')), 'paid'],
    ],
    group: ['Profile.id'],
    include: {
      as: 'Client',
      attributes: [],
      include: {
        attributes: [],
        model: Job,
        where: {
          paid: true,
          paymentDate: {
            [Op.and]: [
              {
                [Op.gte]: startDate,
              },
              {
                [Op.lte]: endDate,
              },
            ],
          },
        },
      },
      model: Contract,
    },
    order: [[Sequelize.literal('paid'), 'DESC']],
    where: {
      type: 'client',
    },
  });
}

module.exports = {
  earnedByProfession,
  totalSpent,
};

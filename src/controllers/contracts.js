const { Op } = require('sequelize');
const { Contract } = require('../models');

function queryBuilder(query) {
  return Object.keys(query).map((column) => {
    const terms = query[column];
    const search = Array.isArray(terms) ? terms.map((term) => ({ [column]: term })) : { [column]: terms };

    return Array.isArray(terms) ? { [Op.or]: search } : search;
  });
}

async function getContractList(profileId, query = {}) {
  return Contract.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        },
        ...queryBuilder(query),
      ],
    },
  });
}

async function getContract(profileId, query = {}) {
  return Contract.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        },
        ...queryBuilder(query),
      ],
    },
  });
}

module.exports = {
  getContract,
  getContractList,
};

const { Op } = require('sequelize');
const { db } = require('../configs');
const { Job, Contract } = require('../models');

function queryBuilder(query) {
  return Object.keys(query).map((column) => {
    const terms = query[column];
    const search = Array.isArray(terms) ? terms.map((term) => ({ [column]: term })) : { [column]: terms };

    return Array.isArray(terms) ? { [Op.or]: search } : search;
  });
}

async function getJobList(profileId, jobQuery = {}, contractQuery = {}, includeContract = false) {
  return Job.findAll({
    include: {
      ...(includeContract ? {} : { attributes: [] }),
      model: Contract,
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
          },
          ...queryBuilder(contractQuery),
        ],
      },
    },
    where: {
      [Op.and]: queryBuilder(jobQuery),
    },
  });
}

async function getJob(profileId, jobQuery = {}, contractQuery = {}, includeContract = false) {
  return Job.findOne({
    include: {
      ...(includeContract ? {} : { attributes: [] }),
      model: Contract,
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
          },
          ...queryBuilder(contractQuery),
        ],
      },
    },
    where: {
      [Op.and]: queryBuilder(jobQuery),
    },
  });
}

async function markJobAsPaid(profileId, jobId, externalTrasaction) {
  const transaction = await db.transaction();

  try {
    const job = await getJob(profileId, { id: jobId });

    if (!job) {
      throw new Error('Job not found');
    }

    await job.update({ paid: true }, { lock: true, transaction: externalTrasaction || transaction });
  } catch (error) {
    if (!externalTrasaction) {
      await transaction.rollback();
    }

    throw error;
  }
}

module.exports = {
  getJob,
  getJobList,
  markJobAsPaid,
};

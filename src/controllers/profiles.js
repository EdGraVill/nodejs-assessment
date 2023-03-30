const { Op } = require('sequelize');
const { db } = require('../configs');
const { Profile, Contract, Job } = require('../models');

async function transferMoney(originProfileId, destinationProfileId, ammount, externalTrasaction) {
  const transaction = await db.transaction();

  try {
    const originProfile = await Profile.findByPk(originProfileId, {
      lock: true,
      transaction: externalTrasaction || transaction,
    });

    if (!originProfile) {
      throw new Error('Origin profile not found');
    }

    const destinationProfile = await Profile.findByPk(destinationProfileId, {
      lock: true,
      transaction: externalTrasaction || transaction,
    });

    if (!destinationProfile) {
      throw new Error('Destination profile not found');
    }

    if (originProfile.balance < ammount) {
      throw new Error('Not enough funds');
    }

    try {
      await originProfile.decrement('balance', { by: ammount, transaction: externalTrasaction || transaction });
      await destinationProfile.increment('balance', { by: ammount, transaction: externalTrasaction || transaction });
    } catch (error) {
      throw new Error('Error while updating balances');
    }

    if (!externalTrasaction) {
      await transaction.commit();
    }
  } catch (error) {
    if (!externalTrasaction) {
      await transaction.rollback();
    }

    throw error;
  }
}

async function getDebt(profileId) {
  return Job.sum('price', {
    include: {
      model: Contract,
      where: {
        ClientId: profileId,
      },
    },
    where: {
      paid: { [Op.or]: [{ [Op.eq]: null }, { [Op.eq]: false }] },
    },
  });
}

async function depositMoney(profileId, ammount, externalTrasaction) {
  const transaction = await db.transaction();

  try {
    const profile = await Profile.findByPk(profileId, {
      lock: true,
      transaction: externalTrasaction || transaction,
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    try {
      await profile.increment('balance', { by: ammount, transaction: externalTrasaction || transaction });
    } catch (error) {
      throw new Error('Error while updating balance');
    }

    if (!externalTrasaction) {
      await transaction.commit();
    }
  } catch (error) {
    if (!externalTrasaction) {
      await transaction.rollback();
    }

    throw error;
  }
}

module.exports = {
  depositMoney,
  getDebt,
  transferMoney,
};

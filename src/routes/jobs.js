const { Op } = require('sequelize');
const { db } = require('../configs');
const { getJob, getJobList, transferMoney, markJobAsPaid } = require('../controllers');

const Router = require('express').Router;

const router = new Router();

// 1. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.
router.get('/unpaid', async (req, res) => {
  const jobs = await getJobList(
    req.profile.id,
    { paid: { [Op.or]: [{ [Op.eq]: null }, { [Op.eq]: false }] } },
    { status: ['new', 'in_progress'] },
  );

  res.json(jobs);
});

// 1. ***POST*** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
router.post('/:job_id/pay', async (req, res) => {
  const { job_id: jobId } = req.params;

  if (!jobId) {
    return res.status(400).end({ error: true, message: 'Missing job id' });
  }

  const job = await getJob(
    req.profile.id,
    {
      id: req.params.job_id,
      paid: { [Op.or]: [{ [Op.eq]: null }, { [Op.eq]: false }] },
    },
    {
      ClientId: req.profile.id,
    },
    true,
  );

  if (!job) {
    return res.status(404).json({ error: true, message: 'Job not found' });
  }

  if (req.profile.balance < job.price) {
    return res.status(402).json({ error: true, message: 'Insufficient funds' });
  }

  const transaction = await db.transaction();

  try {
    await transferMoney(req.profile.id, job.Contract.ContractorId, job.price, transaction);
    await markJobAsPaid(req.profile.id, jobId, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: true, message: error.message });
  }

  res.json({ error: false, message: 'Payment successful' });
});

module.exports = router;

const { db } = require('../configs');
const { getDebt, transferMoney } = require('../controllers');
const { Profile } = require('../models');

const Router = require('express').Router;

const router = new Router();

// 1. ***POST*** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
router.post('/deposit/:userId', async (req, res) => {
  const { userId } = req.params;
  const { ammount } = req.body;

  if (!userId) {
    return res.status(400).json({ error: true, message: 'Missing userId' });
  }

  if (req.profile.id === Number(userId)) {
    return res.status(400).json({ error: true, message: 'You can not deposit money to yourself' });
  }

  if (!ammount) {
    return res.status(400).json({ error: true, message: 'Missing ammount in the body call' });
  }

  const receiver = await Profile.findByPk(userId);

  if (!receiver) {
    return res.status(404).json({ error: true, message: 'Receiver not found' });
  }

  if (receiver.type !== 'client') {
    return res.status(400).json({ error: true, message: 'Receiver is not a client' });
  }

  if (req.profile.balance < ammount) {
    return res.status(400).json({ error: true, message: 'Not enough funds' });
  }

  const debt = await getDebt(req.profile.id);
  const maxDeposit = debt * 0.25;

  if (ammount > maxDeposit) {
    return res.status(400).json({ error: true, message: 'Deposit limit exceeded' });
  }

  const transaction = await db.transaction();

  try {
    await transferMoney(req.profile.id, receiver.id, ammount, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({ error: true, message: error.message });
  }

  res.json({ error: false, message: 'Deposit successful' });
});

module.exports = router;

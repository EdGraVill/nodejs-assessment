const Router = require('express').Router;
const { getContract, getContractList } = require('../controllers');

const router = new Router();

// 1. ***GET*** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.
router.get('/', async (req, res) => {
  const contracts = await getContractList(req.profile.id, { status: ['new', 'in_progress'] });

  res.json(contracts);
});

// 1. ***GET*** `/contracts/:id` - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: true, message: 'Missing contract id' });
  }

  const contract = await getContract(req.profile.id, { id });

  if (!contract) {
    return res.status(404).json({ error: true, message: 'Contract not found' });
  }

  res.json(contract);
});

module.exports = router;

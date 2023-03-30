const { earnedByProfession, totalSpent } = require('../controllers');

const Router = require('express').Router;

const router = new Router();

router.use((req, res, next) => {
  const { start, end = new Date().toISOString().slice(0, 10) } = req.query;

  if (!start) {
    return res.status(400).json({ error: true, message: 'Missing start query parameter' });
  }

  if (Number.isNaN(Date.parse(start)) || Number.isNaN(Date.parse(end))) {
    return res.status(400).json({ error: true, message: 'start or end query parameter is not a valid date' });
  }

  if (new Date(start) > new Date(end)) {
    return res.status(400).json({ error: true, message: 'start date is greater than end date' });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  req.startDate = startDate;
  req.endDate = endDate;

  next();
});

// 1. ***GET*** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
router.get('/best-profession', async (req, res) => {
  const { startDate, endDate } = req;

  const professions = await earnedByProfession(startDate, endDate);

  if (!professions.length) {
    return res.status(404).json({ error: true, message: 'No data found in the date range' });
  }

  const bestProfession = professions[0];

  if (bestProfession.dataValues.totalEarned === null) {
    return res.status(404).json({ error: true, message: 'No data found in the date range' });
  }

  res.json(bestProfession);
});

// 1. ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default
router.get('/best-clients', async (req, res) => {
  const {
    startDate,
    endDate,
    query: { limit = 2 },
  } = req;

  if (Number.isNaN(Number(limit)) || Number(limit) < 1) {
    return res.status(400).json({ error: true, message: 'limit query parameter is not a valid number' });
  }

  const profiles = await totalSpent(startDate, endDate);

  // For an already known bug in sequelize, limit is not working when using include and group in the query
  res.json(profiles.slice(0, limit));
});

module.exports = router;

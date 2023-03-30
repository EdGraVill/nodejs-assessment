const Router = require('express').Router;
const adminRouter = require('./admin');
const balancesRouter = require('./balances');
const contractsRouter = require('./contracts');
const jobsRouter = require('./jobs');

const router = new Router();

// Routes without authentication

router.use((req, res, next) => {
  if (!req.profile) {
    return res.status(401).end();
  }

  next();
});

// Routes with authentication

router.use('/admin', adminRouter);
router.use('/balances', balancesRouter);
router.use('/contracts', contractsRouter);
router.use('/jobs', jobsRouter);

module.exports = router;

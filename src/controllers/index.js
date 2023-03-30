const adminControllers = require('./admin');
const contractControllers = require('./contracts');
const jobControllers = require('./jobs');
const profileControllers = require('./profiles');

module.exports = {
  ...adminControllers,
  ...contractControllers,
  ...jobControllers,
  ...profileControllers,
};

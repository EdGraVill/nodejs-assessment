const Contract = require('./contract');
const Job = require('./job');
const Profile = require('./profile');

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor' });

Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });

Contract.hasMany(Job);
Job.belongsTo(Contract);

module.exports = {
  Contract,
  Job,
  Profile,
};

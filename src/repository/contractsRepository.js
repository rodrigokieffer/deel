const { Op } = require("sequelize")
const models = require('../model')

const contractById = (id, profileId) => {
  const { Contract } = models
  const contract = Contract.findOne({ where: { id, ClientId: profileId }})

  return contract
}

const allClientContracts = id => {
  const { Contract } = models
  const contracts = Contract.findAll({ where: {
    status: { [Op.ne]: 'terminated' },
    [Op.or]: [
        { ClientId: id },
        { ContractorId: id }
    ]
  }})

  return contracts
}

module.exports = {
  allClientContracts,
  contractById
}
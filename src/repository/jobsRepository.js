const sequelize = require("sequelize")
const { Op } = require("sequelize")
const models = require('../model')

const jobInfoById = id => {
  const { Job, Contract } = models

  const job = Job.findOne({
    include: {
      model: Contract,
  },
  where: { id }
  })

  return job
}

const unpaidClientOrContractorsJobs = id => {
  const { Job, Contract } = models

  const jobs = Job.findAll({
    include: {
        model: Contract,
        where: {
            status: { [Op.ne]: 'terminated' },
            [Op.or]: [
                { ClientId: id },
                { ContractorId: id }
            ]
        }
    },
    where: {
        paid: {
            [Op.not]: true
        },
    }
  })

  return jobs
}

const updatePaymentJobById = id => {
  const { Job } = models

  const today = new Date()
  Job.update({ paid: true, paymentDate: today.toISOString() }, { where: { id: id } })
}

const unpaidClientJobs = id => {
  const { Job, Contract } = models

  const jobs = Job.findAll({
    include: {
        model: Contract,
        where: {
          status: { [Op.ne]: 'terminated' },
          ClientId: id
        }
    },
    where: {
        paid: {
            [Op.not]: true
        },
    }
  })

  return jobs
}

const jobsRange = (start, end) => {
  const { Job, Contract, Profile } = models

  const jobs = Job.findAll({
    include: {
      model: Contract,
      attributes: ['ContractorId'],
      include: { model: Profile, as: 'Contractor' }
    },
    where: {
      paymentDate: {
          [Op.between]: [start, end]
      },
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'total'],
    ],
    group: ['Contract.ContractorId'],
    order: sequelize.literal('total DESC')
  })

  return jobs
}

const jobsClientRange = (start, end, limit) => {
  const { Job, Contract, Profile } = models

  const jobs = Job.findAll({
    include: {
      model: Contract,
      attributes: ['ClientId'],
      include: { model: Profile, as: 'Client' }
    },
    where: {
      paymentDate: {
          [Op.between]: [start, end]
      },
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'total'],
    ],
    group: ['Contract.ClientId'],
    order: sequelize.literal('total DESC'),
    limit,
  })

  return jobs
}


module.exports = {
  unpaidClientOrContractorsJobs,
  jobInfoById,
  updatePaymentJobById,
  unpaidClientJobs,
  jobsRange,
  jobsClientRange
}
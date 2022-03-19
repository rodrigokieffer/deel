const { jobInfoById, updatePaymentJobById, jobsRange, jobsClientRange } = require('../repository/jobsRepository')
const { profileById, updateProfileBalance } = require('../repository/profileRepository')

const payJobById = async (profile, jobId) => {
  try {
    const jobInfoToPay = await jobInfoById(jobId)

    const { price } = jobInfoToPay
    if (profile.balance < price) {
      throw new Error('Not enough funds')
    }

    const { ContractorId } = jobInfoToPay.Contract
    const contractor = await profileById(ContractorId)

    profile.balance -= price
    contractor.balance += price
    await Promise.all([updatePaymentJobById(jobId), updateProfileBalance(profile), updateProfileBalance(contractor)])
  } catch (error) {
    throw new Error('Payment not processed')
  }
}

const bestProfession = async (start, end) => {
  try {
    const jobs = await jobsRange(start, end)
    const profession = jobs[0];

    return profession.Contract.Contractor
  } catch (error) {
    console.error(error)
  }
}

const bestClients = async (start, end, limit = 2) => {
  try {
    const jobs = await jobsClientRange(start, end, limit)

    const result = jobs.map(item => {
      const payload = {
        id: item.Contract.Client.id,
        fullName: `${item.Contract.Client.firstName} ${item.Contract.Client.lastName}`,
        paid: item.dataValues.total
      }

      return payload
    })

    return result
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  payJobById,
  bestProfession,
  bestClients
}
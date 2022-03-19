const { unpaidClientJobs } = require('../repository/jobsRepository')
const { profileById, updateProfileBalance } = require('../repository/profileRepository')

const depositForUserId = async payload => {
  const { clientId, amount } = payload
  const MAX_PERCENT = (25 / 100) + 1

  const [profile, unpaidJobs] = await Promise.all([profileById(clientId), unpaidClientJobs(clientId)])
  const totalPriceToPay = unpaidJobs.reduce((acc, item) => acc += item.price, 0.0)

  const maxValueToDeposit = totalPriceToPay * MAX_PERCENT
  if (amount > maxValueToDeposit) {
    throw new Error('Cannot deposit more than 25% his total of jobs to pay')
  }

  profile.balance += amount
  await updateProfileBalance(profile)
}

module.exports = {
  depositForUserId
}
const { unpaidClientJobs } = require('../src/repository/jobsRepository')
const { profileById, updateProfileBalance } = require('../src/repository/profileRepository')
const { depositForUserId } = require('../src/services/balanceService')

jest.mock('../src/repository/jobsRepository')
jest.mock('../src/repository/profileRepository')

describe('Balance Service tests', () => {
  const mockedProfile = {
    id: 1,
    firstName: 'Harry',
    lastName: 'Potter',
    profession: 'Wizard',
    balance: 1150,
    type:'client'
  }

  const mockedUnpaidJobs = [
    {
      description: 'work',
      price: 100,
      ContractId: 1,
    },
    {
      description: 'work',
      price: 200,
      ContractId: 2,
    }
  ]

  beforeEach(() => {
    unpaidClientJobs.mockReset()
    profileById.mockReset()
    updateProfileBalance.mockReset()
  })

  test('When try to deposit a value greater than 25% of total jobs to paid, should throw an error', async () => {
    const payload = {
      clientId: 1,
      amount: 600
    }

    profileById.mockResolvedValue(mockedProfile)
    unpaidClientJobs.mockResolvedValue(mockedUnpaidJobs);

    await expect(depositForUserId(payload)).rejects.toEqual(new Error('Cannot deposit more than 25% his total of jobs to pay'))
  })

  test('When try to deposit a value less than 25% of total jobs to paid, should update balance have to be called', async () => {
    const payload = {
      clientId: 1,
      amount: 100
    }

    profileById.mockResolvedValue(mockedProfile)
    unpaidClientJobs.mockResolvedValue(mockedUnpaidJobs);

    await depositForUserId(payload)
    expect(updateProfileBalance).toHaveBeenCalledTimes(1)
  })
})
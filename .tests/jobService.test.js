const { jobInfoById, updatePaymentJobById, jobsRange, jobsClientRange } = require('../src/repository/jobsRepository')
const { profileById, updateProfileBalance } = require('../src/repository/profileRepository')
const { payJobById, bestProfession, bestClients } = require('../src/services/jobService')

jest.mock('../src/repository/jobsRepository')
jest.mock('../src/repository/profileRepository')

describe('Jobs Service tests', () => {
  const mockedClient = {
    id: 1,
    firstName: 'Harry',
    lastName: 'Potter',
    profession: 'Wizard',
    balance: 1150,
    type:'client'
  }

  const mockedContractor = {
    id: 8,
    firstName: 'Aragorn',
    lastName: 'II Elessar Telcontarvalds',
    profession: 'Fighter',
    balance: 314,
    type:'contractor'
  }

  beforeEach(() => {
    jobInfoById.mockReset()
    updatePaymentJobById.mockReset()
    jobsRange.mockReset()
    jobsClientRange.mockReset()
    profileById.mockReset()
    updateProfileBalance.mockReset()
  })

  test('When client paid a job, should updatePaymentJobById and updateProfileBalance have to be called', async () => {
    const mockedJobInfoToPay = {
      description: 'work',
      price: 100,
      ContractId: 2,
      Contract: {
        ContractorId: 8
      }
    }

    jobInfoById.mockResolvedValue(mockedJobInfoToPay)
    profileById.mockResolvedValue(mockedContractor)

    await payJobById(mockedClient, 1)

    expect(updatePaymentJobById).toHaveBeenCalledTimes(1)
    expect(updateProfileBalance).toHaveBeenCalledTimes(2)
  })

  test('When client try paid a job without suficient balance, should throw an Error', async () => {
    const mockedJobInfoToPay = {
      description: 'work',
      price: 2000,
      ContractId: 2,
      Contract: {
        ContractorId: 8
      }
    }

    jobInfoById.mockResolvedValue(mockedJobInfoToPay)
    profileById.mockResolvedValue(mockedContractor)

    await expect(payJobById(mockedClient, 1)).rejects.toEqual(new Error('Payment not processed'))
  })

  test('When request best profession, should return the most earned profession', async () => {
    const start = '2020-08-01T00:00:00.000Z'
    const end = '2020-08-30T00:00:00.000Z'

    const jobs = [
      {
        description: 'work',
        price: 200,
        paid:true,
        paymentDate:'2020-08-17T19:11:26.737Z',
        ContractId: 1,
        Contract: {
          Contractor: {
            ...mockedContractor
          }
        }
      },
      {
        description: 'work',
        price: 100,
        paid:true,
        paymentDate:'2020-08-21T19:11:26.737Z',
        ContractId: 2,
        Contract: {
          Contractor: {
            id: 7,
            firstName: 'Alan',
            lastName: 'Turing',
            profession: 'Programmer',
            balance: 22,
            type:'contractor'
          }
        }
      }
    ]

    jobsRange.mockResolvedValue(jobs)
    const contractor = await bestProfession(start, end)

    expect(contractor).toEqual(mockedContractor)
  })

  test('When request best clients list, should return the most paid clients', async () => {
    const start = '2020-08-01T00:00:00.000Z'
    const end = '2020-08-30T00:00:00.000Z'

    const jobs = [
      {
        dataValues: {
          total: mockedClient.balance
        },
        description: 'work',
        price: 200,
        paid:true,
        paymentDate:'2020-08-17T19:11:26.737Z',
        ContractId: 1,
        Contract: {
          Client: {
            ...mockedClient
          }
        }
      },
      {
        dataValues: {
          total: 451.3
        },
        description: 'work',
        price: 100,
        paid:true,
        paymentDate:'2020-08-21T19:11:26.737Z',
        ContractId: 2,
        Contract: {
          Client: {
            id: 3,
            firstName: 'John',
            lastName: 'Snow',
            profession: 'Knows nothing',
            balance: 451.3,
            type:'client'
          }
        }
      }
    ]

    mockedClients = [
      {
        id: 1,
        fullName: `${mockedClient.firstName} ${mockedClient.lastName}`,
        paid: mockedClient.balance,
      },
      {
        id: 3,
        fullName: 'John Snow',
        paid: 451.3,
      },
    ]

    jobsClientRange.mockResolvedValue(jobs)
    const clients = await bestClients(start, end, 2)

    expect(clients).toEqual(mockedClients)
  })
})
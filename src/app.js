const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('models', sequelize.models)
const { payJobById, bestProfession, bestClients } = require('./services/jobService')
const { depositForUserId } = require('./services/balanceService')
const { contractById, allClientContracts } = require('./repository/contractsRepository')
const { unpaidClientOrContractorsJobs } = require('./repository/jobsRepository')

app.get('/contracts/:id', getProfile, async (req, res) => {
    const { id } = req.params
    const { id: profileId } = req.profile
    const contract = await contractById(id, profileId)
    if(!contract) return res.status(404).end()
    res.json(contract)
})

app.get('/contracts', getProfile, async (req, res) => {
    const { id } = req.profile

    const contracts = await allClientContracts(id)
    if (!contracts) return res.status(404).end()
    res.json(contracts)
})

app.get('/jobs/unpaid', getProfile, async (req, res) => {
    const { id } = req.profile

    const jobs = await unpaidClientOrContractorsJobs(id)
    if (!jobs) return res.status(404).end()
    res.json(jobs)
})

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    const { job_id } = req.params

    try {
        const { profile } = req
        await payJobById(profile, job_id)

        res.status(201).end()
    } catch (e) {
        res.status(402).end()
    }
})

app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
    const { userId } = req.params
    const { amount } = req.body

    try {
        const payload = {
            clientId: userId,
            amount
        }

        await depositForUserId(payload)
        res.status(201).end()
    } catch (error) {
        res.status(400).end()
    }
})

app.get('/admin/best-profession', getProfile, async (req, res) => {
    const { start, end } = req.query

    try {
        const startDate = new Date(start).toISOString()
        const endDate = new Date(end).toISOString()
        const profession = await bestProfession(startDate, endDate)

        res.json(profession)
    } catch (error) {
        res.status(400).end()
    }
})

app.get('/admin/best-clients', getProfile, async (req, res) => {
    const { start, end, limit } = req.query

    try {
        const startDate = new Date(start).toISOString()
        const endDate = new Date(end).toISOString()
        const clients = await bestClients(startDate, endDate, limit)

        res.json(clients)
    } catch (error) {
        res.status(400).end()
    }
})

module.exports = app;

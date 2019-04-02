
const supertest = require('supertest')
const { app, server } = require('../index.js')
const api = supertest(app)
const smartpools = require('../smartpools/smartpool')
const match1 = require('./testData/smartpoolMatch1')
const match2 = require('./testData/smartpoolMatch2')

beforeAll(async() => {
    await smartpools.createPool(match1)
    await smartpools.createPool(match2)
})

test('upcoming matches are sent as JSON', async () => {
    const response = await api
        .get('/upcoming')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(response.body.length).toEqual(2)
})

test('Match is found by id', async () => {
    const response = await api
        .get('/upcoming/1')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        expect(response.body.name).toEqual('test match')
})
test('400 for wrong id', async () => {
    const response = await api
        .get('/upcoming/3')
        .expect(404)

        expect(response.body).toEqual({error: 'Match not found'})
})

afterAll(() => {
    server.close()
})
const assert = require('assert')
const loki = require('lokijs')
const smartpools = require('../smartpools/smartpool')
const match1 = require('./testData/smartpoolMatch1')
const match2 = require('./testData/smartpoolMatch2')
const match3 = require('./testData/smartpoolMatch3')
const bets = require('./testData/betsTestData')
const db = new loki('esports')
const upcomingPools =  db.addCollection('upcomingPools')

beforeAll(async() => {
    smartpools.setDB(upcomingPools)
    await smartpools.createPool(match1)
    await smartpools.createPool(match2)
})

describe('Creating and getting pools works', () => {
    it('Gets all pools', () => {
        const pools = smartpools.getAll()
        assert.equal(pools.length, 2)
    })
    it('Finds match pools (also create pools work)', async () => {
        const one = await smartpools.getPool(1)
        const two = await smartpools.getPool(2)

        assert.equal(one.name, 'test match')
        assert.equal(two.name, 'test match 2')
    })
    it('GetOrCreatePool gets if id exists',  () => {
        smartpools.getOrCreatePool({id: 1, name: 'This shouldnt be seen'})
        .then(pool => assert.equal(pool.name, 'test match'))
    })
    it('GetOrCreatePool creates if id doesnt exist', () => {
        smartpools.getOrCreatePool(match3)
        .then(pool => assert.equal(pool.name, 'test match 3'))

    })
    
})
describe('Adding bets', () => {
    it('Adds bets to correct match pools', async () => {
        // console.log(bets[0])
        smartpools.addBet(bets[0])
        smartpools.addBet(bets[1])
        const pool = await smartpools.getPool(match1.id)
        assert.equal(pool.bets.length, 2)
    })
    it('Cannot add bets to nonexisting pools', () => {
        const re = smartpools.addBet({
            match_id: 123123,
            bet_id: 1123,
            bet: 100,
            team_id: 1
        })
        assert.equal(re.error, 'No match')
    })
    it('Cannot duplicate bets to the DB', () => {
        const re = smartpools.addBet({
            match_id: 1,
            bet_id: 1,
            bet: 100,
            team_id: 1
        })
        assert.equal(re.error, 'bet already exists')

    })
})

describe('Deleting pools works', () => {
    it('Deletes with correct id', async () => {
        const deleted = smartpools.deletePool(match1.id)
        assert.equal(deleted.name, 'test match')
        const pool = await smartpools.getPool(match1.id)
        assert.equal(pool, undefined)
    })
    it('Returns undefined with incorrect id', () => {
        const deleted = smartpools.deletePool(match1.id)
        assert.equal(deleted, undefined)  
    })
})


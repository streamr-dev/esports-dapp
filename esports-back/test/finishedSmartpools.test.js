const assert = require('assert')
const finished = require('../smartpools/finishedSmartpools') 
const match1 = require('./testData/smartpoolMatch1')
const match2 = require('./testData/smartpoolMatch2')
const match3 = require('./testData/smartpoolMatch3')
const loki = require('lokijs')
const db = new loki('esports')
const finishedPools =  db.addCollection('finishedPools')

beforeAll(() => {
    finished.setDB(finishedPools)
    finished.createPool(match1)
    finished.createPool(match2)
})

describe('Creating pools works', () => {
    it('Creates and gets all pools', ()  => {
        finished.createPool(match3)
        const all = finished.getAll()
        assert.equal(all.length, 3)
    })
})
describe('Deleting pools', () => {
    it('deletes existing pools', () => {
        const re = finished.deletePool(match3.id)
        assert.equal(re.name, 'test match 3')
        const pool = finished.getPool(match3.id)
        assert.equal(pool, undefined)
    })
    it('Returns undefined with incorrect id', () => {
        const deleted = finished.deletePool(match3.id)
        assert.equal(deleted, undefined)  
    })
})
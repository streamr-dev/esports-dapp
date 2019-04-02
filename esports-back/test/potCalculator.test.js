const potCalculator = require('../utils/potCalculator')
const assert = require('assert')
// There should only be 2 teams per match so only 2 team IDs necessary
const betsTestData = require('./testData/betsTestData.json') 
describe("Bet pool total calculator" , () => {
    it('correctly calculates total pot', () => {
        const pot = potCalculator.calculateAll(betsTestData)
        assert.equal(pot, 5781)
    })
    it('correctly calculates empty list of bets', () => {
        const pot = potCalculator.calculateAll([])
        assert.equal(pot,0)
    })
})
describe("Team win pot calculator", () => {
    it('correctly calculates betting pool for teams', () => {
        const wins1 = potCalculator.calculateTeamPot(betsTestData, 2)
        const wins2 = potCalculator.calculateTeamPot(betsTestData, 3)
        assert.equal(wins1, 3450)
        assert.equal(wins2, 2331)
    })
    it('correctly calculates pots for empty lists', () => {
        const wins1 = potCalculator.calculateTeamPot([], 2)
        const wins2 = potCalculator.calculateTeamPot([], 3)    
        assert.equal(wins1, 0)
        assert.equal(wins2, 0)
    })
})
describe("Removing losing bets from list", () => {
    it('correctly removes losing teams', () => {
        const winners1 = potCalculator.removeLosers(betsTestData, 2)
        const winners2 = potCalculator.removeLosers(betsTestData, 3)
        assert.equal(winners1.length, 4)
        assert.equal(winners2.length, 5)
    })
})
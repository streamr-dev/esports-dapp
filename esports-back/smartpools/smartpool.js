
let db; // Lokijs db collection, set function called from index.js
const blockchain = require('./blockchainBets')

// Get a match betting pool based on id
const getPool = async (matchId) => {
    return await db.findOne({ id: matchId })
}

// Create a new pool by the received match data
const createPool = async (match) => {
    if (match.teams === [] || match.teams[0] === undefined || match.teams[1] === undefined) {
        // console.log("Teams TBD for: ", match.id)
        return
    }
    // Make sure smart contract isn't called during unit tests
    if (process.env.NODE_ENV !== 'test') {
        blockchain.setMatchClosingTimestamp(match.id, (new Date(match.begin_at).getTime() / 1000) - 300)
    }
    return await db.insert({ id: match.id, 
                    name: match.name,
                    begin_at: match.begin_at,
                    teams: match.teams.map(team => {
                        return {name: team.name, id: team.id}
                        }),
                    bets: [],
                })
    
}

// Get all match pools
const getAll = () => {
    return db.data
}

// Delete a match pool
const deletePool = (matchId) => {
    const found = db.findOne({id: matchId})
    if (found === undefined || found === null) {
        return
    }
    return db.remove(matchId)
} 
// Get a pool if it exists and create a new one if it doesn't
const getOrCreatePool = async (match) => {
    const didGet = db.findOne({id:match.id})
    if (didGet === undefined || didGet === null) {
        const didCreate = await createPool(match)
        //return new pool
        return didCreate
    }
    // return existing pool
    return didGet
}

// Add a new bet to the in memory database after running it through the smart contract
const addBet = (bet) => {
    console.log(bet)
    const didGet = db.findOne({id: bet.match_id})
    console.log(didGet)
    if (didGet === undefined || didGet === null) {
        return {error: 'No match'}
    }
    for (let i = 0; i < didGet.bets.length; i++) {
        if (didGet.bets[i].bet_id === bet.bet_id) {
            return {error: 'bet already exists'}
        }
    }
    didGet.bets.push(bet)
    db.update(didGet) 
}

// Set DB for the module
const setDB = (set) => { 
    db = set;
    
}


module.exports = {getPool, createPool, deletePool, getOrCreatePool, setDB, getAll, addBet}
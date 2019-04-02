
let db; // Lokijs db collection, set function called from index.js

const getPool = (matchId) => {
    return db.findOne({ id: matchId })
}

const createPool = (match) => {
    return db.insert(match)
}

const deletePool = (matchId) => {
    const found = db.findOne({id: matchId})
    if (found === undefined || found === null) {
        return found
    }
    return db.remove(matchId)
}

const getOrCreatePool = (match) => {
    const didGet = getPool(match.id)
    if (didGet === undefined || didGet === null) {
        const didCreate = createPool(match)
        // Return new pool
        return didCreate
    }
    // Return existing pool
    return didGet
}

const setDB = (set) => { // Set DB for the module
    db = set;
    
}
const getAll = () => {
    return db.data
}

module.exports = {getOrCreatePool, createPool, deletePool, getPool, setDB, getAll}
const config = require('../utils/config')
const smartpool = require('./smartpool')
const finishedSmartpools = require('./finishedSmartpools')
const StreamrClient = require('streamr-client')
const blockchainBets = require('./blockchainBets')
const client = new StreamrClient({
    apiKey: config.streamrApiKey,
})

// Do things with matches in Stremr based on status
const analyzeMatch = async (match) => {
    // Create or get a pool for upcoming matches
    if (match.status === "not_started") {
        smartpool.getOrCreatePool(match, "upcomingPools")
        return
    }
    // No implementation for running games yet!
    if (match.status === "running") {
        return
    }    
    // Matches in Streamr that are finished with winner data assigned to them
    // start sending payouts trought smart contracts to bet winners here
    if (match.status === "finished") {
        // PAYOUT BETS HERE
        const finishedPool = await smartpool.getPool(match.id)
        if (finishedPool === undefined || finishedPool === null || match.winner === null) {
        } else {
            // Initiate a payout to the smart contract
            blockchainBets.payOutInit(finishedPool, match.winner.id)
            // Can be used to save data of the payouts!
            finishedSmartpools.createPool(finishedPool)
            // Delete the pool from upcoming games
            smartpool.deletePool(match.id)
        }
        return
    }
}

// Function to set the backend to subscribe to stream in Streamr
const streamListener = (streamId, streamName) => {
    // Subscribing to a stream
    const subscription = client.subscribe({stream: streamId},
        (message, metadata) => {
            // Called on updates in the stream
            console.log(streamName, ':_________________________')
            for (i in message[streamName]) {
                // analyze what to do with the match based on status
                analyzeMatch(message[streamName][i])
            }
        }
    )
    // Called when subscription is first made
    subscription.on('subscribed', function() {
        console.log('Subscribed to '+subscription.streamId)
    })
}

module.exports = {streamListener}
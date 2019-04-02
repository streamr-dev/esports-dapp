const config = require('./utils/config')
const streamr = require('./smartpools/streamr')
const http = require('http')
const express = require('express')
const app = express()
const smartpool = require('./smartpools/smartpool')
const finished = require('./smartpools/finishedSmartpools')
const loki = require('lokijs')

const db = new loki('esports')
const upcomingPools =  db.addCollection('upcomingPools')
const finishedSmartpools = db.addCollection('finishedSmartpools')
const cors = require('cors')
app.use(cors())
const upcomingMatchesRouter = require('./routers/upcomingMatches')
app.use(upcomingMatchesRouter)

app.get('/', (req, res) => { // Frontpage HTML
    res.send('<h1>Esports-back!!</h1>')
})

smartpool.setDB(upcomingPools) // Set DB document for upcoming matches
finished.setDB(finishedSmartpools) // Set DB document for finished matches

// Do not run these during testing
if (process.env.NODE_ENV !== 'test') {
    const blockchain = require('./smartpools/blockchainBets')
    blockchain.blockchainListener()

    streamr.streamListener(config.upcomingStream, 'not_started')
    // const running = streamr.streamListener(config.runningStream, 'running')
    streamr.streamListener(config.finishedStream, 'finished')
}

const server = http.createServer(app)

var PORT = process.env.PORT || config.port


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// For tests
module.exports = {
    app, server
}
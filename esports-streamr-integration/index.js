const streamGames = require('./streamr/streamGames')

console.log('Running..')

// Start the Streamr integration script
setInterval(streamGames.streamMatches, 4000)
const tools = require('.././utils/tools')
const config = require('.././utils/config')
const pandaScore = require('.././pandascore/API_calls')
const StreamrClient = require('streamr-client')

const client = new StreamrClient({
    apiKey: config.streamrApiKey,
})

// Stream an array of JSONs that contain matches with the same status
const streamMultipleMatches = async (status, stream, matches) => { 
    const mappedMatches = matches.map(match => tools.dataMapper(match)) // Map the data to a consistent format
    const msg = {
        [status]: mappedMatches
    }

    await stream.produce(msg)                                     // Push to data to the stream
        .then(() => console.log('Sent successfully: ', status))
        .catch((err) => console.log(err))

} 

 // Gets or creates a stream that has a list of matches with the same status
const getStreamForList = async (status, matches) => {            
    await client.getOrCreateStream({
        name: config.videogame + "__" + status
    })
        .then((stream) => streamMultipleMatches(status, stream, matches))
        .catch(err => console.log(err))
}

// sorts and pushes all matches from pandascore API to Streamr
const streamMatches = () => {
    pandaScore.getAllMatches() // API call
        .then(async matches => {
            // Sort the matches by status
            const sorted = tools.sortDataByStatus(matches) 
            await getStreamForList('finished', sorted.finished)
            await getStreamForList('running', sorted.running)
            await getStreamForList('not_started', sorted.not_started)
        })
        .catch(err => console.log(err))
}
module.exports = {streamMatches}
require('dotenv').config()

const streamrApiKey = process.env.STREAMR_API_KEY


// CSGO by default
// All streams could also be ran through the same backend
const upcomingStream = process.env.CSGO_UPCOMING_MATCHES_STREAM_ID
const runningStream = process.env.CSGO_RUNNING_MATCHES_STREAM_ID
const finishedStream = process.env.CSGO_FINISHED_MATCHES_STREAM_ID

if (process.env.VIDEOGAME ==='dota2') {
    upcomingStream = process.env.DOTA2_UPCOMING_MATCHES_STREAM_ID
    runningStream = process.env.DOTA2_RUNNING_MATCHES_STREAM_ID
    finishedStream = process.env.DOTA2_FINISHED_MATCHES_STREAM_ID
}
if (process.env.VIDEOGAME ==='lol') {
    upcomingStream = process.env.LOL_UPCOMING_MATCHES_STREAM_ID
    runningStream = process.env.LOL_RUNNING_MATCHES_STREAM_ID
    finishedStream = process.env.LOL_FINISHED_MATCHES_STREAM_ID
}
if (process.env.VIDEOGAME ==='ow') {
    upcomingStream = process.env.OW_UPCOMING_MATCHES_STREAM_ID
    runningStream = process.env.OW_RUNNING_MATCHES_STREAM_ID
    finishedStream = process.env.OW_FINISHED_MATCHES_STREAM_ID
}
const betfactoryAddress = process.env.BETFACTORY_ADDRESS
const privateKey = process.env.METAMASK_PRIVATE_KEY
let port = '3003';
if (process.env.NODE_ENV === 'test') {
    port = '3004'
}
module.exports = {privateKey, streamrApiKey, finishedStream, upcomingStream, runningStream, port, betfactoryAddress}

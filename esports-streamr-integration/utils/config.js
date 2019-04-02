require('dotenv').config()

const streamrApiKey = process.env.STREAMR_API_KEY
const pandaScoreToken = process.env.PANDASCORE_TOKEN
const videogame = process.env.VIDEOGAME

module.exports = {videogame, streamrApiKey, pandaScoreToken}

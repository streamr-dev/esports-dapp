const config = require('.././utils/config')
const axios = require('axios')

const baseUrl = "https://api.pandascore.co/" + `${config.videogame}/matches`

const getRunningMatches  = async () => {
    const request = axios.get(baseUrl + '/running?token=' + config.pandaScoreToken)
    return await request.then(response => response.data)
}

const getPastMatches  = async () => {
    const request = axios.get(baseUrl + '/past?token=' + config.pandaScoreToken)
    return await request.then(response => response.data)
}

const getUpcomingMatches  = async () => {
    const request = axios.get(baseUrl + '/upcoming?token=' + config.pandaScoreToken)
    return await request.then(response => response.data)
}

const getAllMatches = async () => {
    const request = axios.get(baseUrl + '?token=' + config.pandaScoreToken)
    return await request.then(response => response.data)
}
module.exports = {getRunningMatches, getPastMatches, getUpcomingMatches, getAllMatches}
import axios from 'axios'
import config from '../utils/config'
const baseUrl = config.baseUrl

// Get simple data for all matches
const getUpcomingMatches = async () => {
    const request = axios.get(baseUrl + "/upcoming")
    return await request.then(response => response.data)
}

// Get more complex data for a single match
const getMatchData = async (id) => {
    const request = axios.get(baseUrl + "/upcoming/" +id)
    return await request.then(response => response.data)
}
export default {getUpcomingMatches, getMatchData}
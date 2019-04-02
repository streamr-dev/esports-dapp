// Map the data from Pandascore to the stream format
// You can add more data fields from the API to Streamr here
const dataMapper = (match) => {
    const gameStreamData = {}
    gameStreamData['id'] = match.id
    gameStreamData['name'] = match.name
    gameStreamData['teams'] = match.opponents.map(opp => {
        return {
            name: opp.opponent.name,
            id: opp.opponent.id,
            img: opp.opponent.image_url
        }
    })
    gameStreamData['games'] = match.games.map(game => {
        return {
            begin_at: game.begin_at,
            game_id: game.id,
            winner_id: game.winner.id,
            game_number: game.position
        }
    })
    gameStreamData['results'] = match.results
    if (match.winner !== null && match.winner !== undefined) {
        gameStreamData['winner'] = {
            winner_id: match.winner.id,
            winner_name: match.winner.name
        }
    } else {
        gameStreamData['winner'] = null
    }
    gameStreamData['begin_at'] = match.begin_at
    gameStreamData['status'] = match.status
    return gameStreamData
}

const sortDataByStatus = (matches) => {
    const sortedMatches = {
        not_started: [],
        running: [],
        finished: []
    }
    matches.map(match => {
        if (match['status'] === 'not_started') {
            sortedMatches.not_started.push(match)
        }
        if (match['status'] === 'running') {
            sortedMatches.running.push(match)
        }
        if (match['status'] === 'finished') {
            sortedMatches.finished.push(match)
        }
    })
    // console.log(sortedMatches)
    return sortedMatches
} 
module.exports = {dataMapper, sortDataByStatus}
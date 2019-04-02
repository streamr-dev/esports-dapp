// Calculate a total value of a betting pool
const calculateAll = (bets) => {
    let total = 0;
    bets.map(bet => {
        total += bet.bet
    })
    return total;
}

// Removes losing bets
const removeLosers = (bets, winner_id) => {
    const winners = []
    bets.map(bet => {
        if (bet.team_id === winner_id) {
            winners.push(bet)
        }
    })
    return winners
} 

// Calculate betting pot for one team
const calculateTeamPot = (bets, team_id) => {
    let total = 0;
    bets.map(bet => {
        if (bet.team_id === team_id) {
            total += bet.bet
        }
    })
    return total
}

module.exports = {calculateAll, calculateTeamPot, removeLosers} 
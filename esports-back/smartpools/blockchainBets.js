const ethers = require('ethers')
const config = require('../utils/config')
const potCalc = require('../utils/potCalculator')

const url = "http://localhost:8545";
const provider = new ethers.providers.JsonRpcProvider(url);
const abi = require('./betFactoryABI')

const signer = provider.getSigner()
const contract = new ethers.Contract(config.betfactoryAddress, abi, signer)



const blockchainListener = () => {
    // Receipt of new bets
    contract.on("NewBet", (matchId, betId, teamId, value) => {
        console.log('match: ',  JSON.stringify(+matchId), '  teamId: ', JSON.stringify(+teamId), '  value: ', JSON.stringify(+value), '  betId: ', JSON.stringify(+betId))

        const bet = {
            match_id: +matchId,
            bet_id: betId,
            team_id: +teamId,
            bet: +value
        }
        const smartpool = require('./smartpool') 
        smartpool.addBet(bet)
    })

    // Receipt of payouts for winners
    contract.on("WinPayedOut", (win, address) => {
        console.log(+win)
        console.log(address)

    })
}

// Set a closing timestamp for a match in the smart contract
// 5 min before match start
const setMatchClosingTimestamp = async (matchId, begin) => {
    await contract.functions.setTimestamp(matchId, begin)
}

// Initiate payouts to winners 
const payoutInit = (finishedMatch, winnerId) => {
    const winners = potCalc.removeLosers(finishedMatch.bets, winnerId)
    const total = potCalc.calculateAll(finishedMatch.bets)
    const winnersPot = potCalc.calculateAll(winners)
    
    console.log(winners)
    winners.map(async bet => {
        const win = Math.floor(total * (bet.bet / winnersPot))
        const overrides = {
            value: win,
            gasLimit: 50000
        }
        await contract.payOut(bet.bet_id, overrides)
    })

}


module.exports = {
    blockchainListener, setMatchClosingTimestamp, payoutInit
}
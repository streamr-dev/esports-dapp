import {ethers} from 'ethers'
import config from '../utils/config'
import abi from './betFactoryABI.json'

let wallet;

// Send a function call to create a new bet to the smart contract
const CreateBet = async (bet, teamId, matchId) => {
    const contract = new ethers.Contract(config.betFactoryAddress, abi, wallet)
    try {
        let overrides = { // This is used as a signer because wallet.sign() cannot keep up with nonce
            value: parseInt(bet)
        }
        // Send the function call to the smart contract
        // overrides is a parameter for ethers.js here
        await contract.newBet(matchId, teamId, overrides)
    } catch (err){
        if (err.data) {
            if (err.data.stack.includes('Betpool is closed')) {
                window.alert('Betting is not allowed under 5 minutes before scheduled match starting time')
            }
        }else {
            window.alert(err)
        }        
    }
} 
// Set a for betting wallet
const setWallet = (newWallet) => {
    wallet = newWallet
}

export default {CreateBet, setWallet}
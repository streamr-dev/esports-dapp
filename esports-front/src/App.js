import React, { Component } from 'react';
import './App.css';
import matchesService from './services/matches'
import {ethers} from 'ethers'
import Settings from './components/Settings'
import BetPopup from './components/BetPopup'
import config from './utils/config'
import ethersService from './services/ethersBets'

const abi = require('./services/betFactoryABI')

const provider = new ethers.providers.JsonRpcProvider(config.ethUrl)
// used for BetPopup to listen to NewBet events from the smart contract
const listenerSigner = provider.getSigner()
// used for BetPopup to listen to NewBet events from the smart contract
const listenerContract = new ethers.Contract(config.betFactoryAddress, abi, listenerSigner) 

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upcomingMatches: [],
      privateKey: '',
      wallet: null
    }
}

  componentDidMount() {
    matchesService.getUpcomingMatches().then(matches =>
        this.setState({upcomingMatches: this.sortByDate(matches)})
      )
  }
  sortByDate(matches) {
    return matches.sort(function(a, b) {
      return new Date(a.begin_at) - new Date(b.begin_at)
    })
  }
  // Handler for private key form
  handlePrivateKeyChange = (event) => {
    this.setState({ privateKey: event.target.value })
  }

  // Handler for setting a new wallet
  handleNewWallet = (event) => {
    event.preventDefault()

    if (this.state.wallet !== null) {
      this.setState({wallet: null})
    } else {
      try {
        const wallet = new ethers.Wallet(this.state.privateKey, provider)
        ethersService.setWallet(wallet)
        this.setState({wallet: wallet})
        window.alert("Wallet Connected")
      } catch {
        window.alert("Invalid private Key")
      }
    }
  }
  

  render() {
    // Render all matches based on simple data
    const listUpcoming = this.state.upcomingMatches.map((match) => 
        <ul key={match.id} style={{marginLeft: "3vw"}}>
           <BetPopup
              match={match}
              wallet={this.state.wallet}
              contract={listenerContract}
           />
        </ul>
      );

    return (
      <div>
        <Settings
          handleChange={this.handlePrivateKeyChange}
          handleSubmit={this.handleNewWallet}
          wallet={this.state.wallet}
        />
        <h1>Upcoming games!</h1>
        {this.state.upcomingMatches === null || this.state.upcomingMatches === undefined || this.state.upcomingMatches === [] ?
          <p>No upcoming games to bet for!</p>
          :
          listUpcoming
        }
      </div>
    );
  }
}

export default App;

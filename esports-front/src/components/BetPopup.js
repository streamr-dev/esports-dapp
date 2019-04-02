import React, {Component} from 'react'
import Popup from 'reactjs-popup'
import ethersBets from '../services/ethersBets'
import matchesService from '../services/matches'

// Displaying match betting pool data and sending new bets are handled here
class BetPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            match: null, // Match data
            betValue: 0, // New bet form value
            teamId: '', // New bet form team select
        }

    // SET UP A SMART CONTRACT LISTENER TO KEEP BETTING POOLS UP-TO-DATE
        const contractFilter = this.props.contract.filters.NewBet(this.props.match.id)
        this.props.contract.on(contractFilter, (matchId, betId, teamId, value) => {
            // This if clause should be replaced with a event filter
            // however there seem to be some issues with indexing events in the backend
            if (+matchId === this.props.match.id) { // Only send request for correct match id
                setTimeout(() => { // Timer to make sure backend completes new bet functions first
                    matchesService.getMatchData(matchId).then(match => {
                        this.setState({
                            match: match
                        })
                    }) 
                }, 1500)
            }
        })
  
    }
    
    componentDidMount() {
        // Get match data
        matchesService.getMatchData(this.props.match.id).then(match => {
            this.setState({
                teamId: match.teams[0].id,
                match: match
            })
        }) 
    }

    // render match contents
    popupContent = (match) => {
        return (
            <div style={{fontSize: "14px"}}>
                <p>
                    {match.name}<br/> {match.begin_at}
                </p>
                <p> Total bet pool: {match.totalPool} </p>
                <p> {match.team1Pot.team_name} bet pool: {match.team1Pot.pot} </p>
                <p> {match.team2Pot.team_name} bet pool: {match.team2Pot.pot} </p>
                {this.betForm(match)}
            </div>
        )
    }

    // Handler for bet form value changes
    handleBetValueChange = (event) => {
        this.setState({betValue: event.target.value})
    }
    
    // Handler for bet form team select
    handleTeamSelect = (event) => {
        this.setState({teamId: event.target.value})
    }

    // Handler for submitting new bets
    handleSubmit = async (event) => {
        event.preventDefault()
        if (this.props.wallet === null) {
            window.alert("You have not connected a wallet")
        } else {
            if (window.confirm("Are you sure you want to set a bet for " + this.state.betValue + " Wei?")) {
                await ethersBets.CreateBet(this.state.betValue, this.state.teamId, this.props.match.id)
            }
        }
    }

    // Renders the new bet form
    betForm = (match) => {
        return(
            <form id='betForm'>
                <fieldset>
                    <input onChange={this.handleBetValueChange} type="number" name="betValue" placeholder="bet as Wei"/>
                    <select name="teamlist" form="betForm" onChange={this.handleTeamSelect}>
                        {match.teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                    <button className="betSubmit" type="submit" onClick={this.handleSubmit} id='bet'>
                        Send bet!!
                     </button>
                </fieldset>
            </form>
        )
    }

    render () {
        return (
            <Popup trigger={<button> {this.props.match.name} </button>} position="right center">
            {/* Only render match data if state is set for match */}
                {this.state.match === null || this.state.match === undefined ?
                    <p>LOADING.....</p>
                    :
                    this.popupContent(this.state.match)
                }
            </Popup>
        )
    }
}



export default BetPopup
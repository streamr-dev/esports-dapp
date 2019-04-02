const express = require('express')
const matchRouter = express.Router()
const smartpool = require('.././smartpools/smartpool')
const potCalc = require('../utils/potCalculator')

// REST API GET functionality for getting simple data of all upcoming matches
matchRouter.get('/upcoming', async (req, res) => {
    const upcomingMatches = smartpool.getAll()
    const toFront = []
    upcomingMatches.map(match => {
        toFront.push({
            id: match.id, // ID of a match
            begin_at: match.begin_at, // Begin tome of a match
            teams: match.teams, // Teams playing in the match
            name: match.name // Name of the match
        })
    })
    
    res.setHeader('Content-Type', 'application/json');
    res.send(toFront)
})

// REST API GET functionality for getting complex data for a single match
matchRouter.get('/upcoming/:id', async (req, res) => {
    const match = await smartpool.getPool(parseInt(req.params.id))
    if (match) {
        const toFront = {
            id: match.id, // Id of a match
            begin_at: match.begin_at, // Begin time of a match
            teams: match.teams, // The teams playing in the match
            name: match.name, // Name of the match
            totalPool: potCalc.calculateAll(match.bets), // Total value of all bets
            team1Pot: { // Total value of team 1 pot and team data
                team_id: match.teams[0].id,
                team_name: match.teams[0].name,
                pot: potCalc.calculateTeamPot(match.bets, match.teams[0].id)
            },
            team2Pot: { // Total value of team 2 pot and team data
                team_id: match.teams[1].id,
                team_name: match.teams[1].name,
                pot: potCalc.calculateTeamPot(match.bets, match.teams[1].id)
            }
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(toFront)
    } else {
        res.status(404).send({ error: 'Match not found' })
    }
})



module.exports = matchRouter
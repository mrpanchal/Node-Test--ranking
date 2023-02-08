const express = require('express')
const {
    createScore,
    getScore,
    getRank,
    getCurrentRank,
    getScoreGraph
} = require('../controllers/score')
const requireAuth = require('../middleware/requireAuth');

const router = express.Router()

// Require auth for all routes
router.use(requireAuth)

// GET Total score of an user.
router.get('/', getScore)

// POST a new score
router.post('/', createScore)

// showing the curent rank of user
router.get('/currentRank', getCurrentRank)

// Rank of all users acoording to scores they made - leaderbord
router.get('/rank', getRank)

// User's graph of acquired Score
router.get('/scoreGraph', getScoreGraph)

module.exports = router

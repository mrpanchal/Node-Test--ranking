const Score = require('../models/scoreModel')
const mongoose = require('mongoose')

// Getting Total Score data
// Success response
// {
//     "success": true,
//     "message": "Here is your total score",
//     "payload": {
//         "user_id": "6377120df15a720976601f46",
//         "scored": 2333
//     }
// }
const getScore = async (req, res) => {
    const user_id = req.user._id;
    var scored = 0;

    const scoreFind = await Score.find({ user_id }).sort({ createdAt: -1 })

    scoreFind.map((e) => {
        const { score } = e;
        scored = scored + score;
    })
    res.json({
        success: true,
        message: "Here is your total score",
        payload: {
            user_id,
            scored
        }
    });
}

// creating a new score API
// Sample Data
// {
//     "score": 333
// }

// Success response
// {
//     "success": true,
//     "message": "Score is created sucessfully.",
//     "payload": {
//         "user_id": "6377120df15a720976601f46",
//         "score": 333
//     }
// }
const createScore = async (req, res) => {
    const { score } = req.body

    let emptyFields = [];

    if (!score) {
        emptyFields.push('score')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Please fill the score', emptyFields,
            payload: {}
        })
    }

    try {
        const user_id = req.user._id;
        const scored = await Score.create({ score, user_id })
        res.status(200).json({
            success: true,
            message: "Score is created sucessfully.",
            payload: {
                user_id,
                score
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            payload: {}
        })
    }
}



// Showing the curent rank of user
// Success response
// {
//     "success": true,
//     "message": "Here is showing your current ranking position",
//     "payload": {
//         "user_id": "6377120df15a720976601f46",
//         "Rank": 1
//     }
// }
const getCurrentRank = async (req, res) => {
    //const { id } = req.params
    try {
        const user_id = req.user._id;

        const user = await Score.find({ user_id })

        const userRanking = await Score.find()

        let totalScore = Object.values(userRanking.reduce((a, c) => {
            let e = (a[c.user_id] = a[c.user_id] || { user_id: c.user_id, total_score: 0 });
            e.total_score += c.score;
            return a;
        }, {}))

        const totalScore_sort = totalScore.sort((a, b) => {
            return b.total_score - a.total_score
        });


        let rankArray = [];
        let positionRank = []

        for (let i = 0; i < totalScore_sort.length; i++) {
            rankArray[i] = totalScore_sort[i]['total_score'];
        }

        giveRank(rankArray, totalScore_sort).map((e) => {
            if (e.user === user[0].user_id) {
                positionRank.push({ position: e.positionRank })
            }
        })

        var scored = 0;

        const scoreFind = await Score.find({ user_id }).sort({ createdAt: -1 })

        scoreFind.map((e) => {
            const { score } = e;
            scored = scored + score;
        })


        res.json({
            success: true,
            message: 'Here is showing your current ranking position',
            payload: {
                user_id,
                Rank: positionRank[0].position,
                Total_score: scored
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            payload: {}
        })

    }
}


// Rank of all users acoording to scores they made - Leaderbord
// [
//     {
//         "user": "6377120df15a720976601f46",
//         "score": 2333,
//         "positionRank": 1
//     },
//     {
//         "user": "63770b8e7fdb42b27eddc0eb",
//         "score": 999,
//         "positionRank": 2
//     },
//     {
//         "user": "637631f5ec41933e59f951ed",
//         "score": 777,
//         "positionRank": 3
//     },
//     {
//         "user": "6376271b1b3f58d93c6127db",
//         "score": 700,
//         "positionRank": 4
//     }
// ]
const getRank = async (req, res) => {

    const userRanking = await Score.find({})

    let totalScore = Object.values(userRanking.reduce((a, c) => {
        let e = (a[c.user_id] = a[c.user_id] || { user_id: c.user_id, total_score: 0 });
        e.total_score += c.score;
        return a;
    }, {}))

    const totalScore_sort = totalScore.sort((a, b) => {
        return b.total_score - a.total_score
    });

    let rankArray = [];
    for (let i = 0; i < totalScore_sort.length; i++) {
        rankArray[i] = totalScore_sort[i]['total_score'];
    }

    res.send({
        success: true,
        message: "Leaderboard",
        payload: giveRank(rankArray, totalScore_sort)
    })

}

const giveRank = (arrayArg, resultArg) => {
    let rank = 1;
    prev_rank = rank;
    position = 0;

    let UserRanked = []

    for (i = 0; i < arrayArg.length; i++) {


        if (i == 0) {
            position = rank;
            console.log(resultArg[i]['user_id'] + "\t" + arrayArg[i] + "\t" + position) + "\n";
            UserRanked.push({ user: resultArg[i]['user_id'], score: arrayArg[i], positionRank: position })
        } else if (arrayArg[i] != arrayArg[i - 1]) {
            rank++;
            position = rank;
            prev_rank = rank;
            console.log(resultArg[i]['user_id'] + "\t" + arrayArg[i] + "\t" + position) + "\n";
            UserRanked.push({ user: resultArg[i]['user_id'], score: arrayArg[i], positionRank: position })
        } else {
            position = prev_rank;
            rank++;
            console.log(resultArg[i]['user_id'] + "\t" + arrayArg[i] + "\t" + position) + "\n";
            UserRanked.push({ user: resultArg[i]['user_id'], score: arrayArg[i], positionRank: position })
        }
    }

    return UserRanked
}

// User's graph of acquired Score within the date range
// we want to get score from 14-11-2022 to 18-11-2022,
// we will have to specify the query like this :-
// http://localhost:4000/api/score/scoreGraph/6377120df15a720976601f46?startDate=2022-11-14&endDate=2022-11-19
// success response
// {
//     "success": true,
//     "message": "Graph of your acquired scores.",
//     "payload": [
//         {
//             "_id": "6377166fca6d9426868ff29a",
//             "score": 333,
//             "user_id": "6377120df15a720976601f46",
//             "createdAt": "2022-11-18T05:21:51.883Z",
//             "updatedAt": "2022-11-18T05:21:51.883Z",
//             "__v": 0
//         },
//         {
//             "_id": "6377138c5aa037b5695f9d56",
//             "score": 1001,
//             "user_id": "6377120df15a720976601f46",
//             "createdAt": "2022-11-18T05:09:32.358Z",
//             "updatedAt": "2022-11-18T05:09:32.358Z",
//             "__v": 0
//         },
//         {
//             "_id": "63771623e871c1a1a4cd1669",
//             "score": 222,
//             "user_id": "6377120df15a720976601f46",
//             "createdAt": "2022-11-17T05:20:36.004Z",
//             "updatedAt": "2022-11-18T05:20:36.004Z",
//             "__v": 0
//         },
//         {
//             "_id": "63771584c93b4878aaded1df",
//             "score": 111,
//             "user_id": "6377120df15a720976601f46",
//             "createdAt": "2022-11-16T05:17:56.330Z",
//             "updatedAt": "2022-11-18T05:17:56.330Z",
//             "__v": 0
//         },
//         {
//             "_id": "6377154af68dde70bad22219",
//             "score": 666,
//             "user_id": "6377120df15a720976601f46",
//             "createdAt": "2022-11-15T05:16:58.814Z",
//             "updatedAt": "2022-11-18T05:16:58.814Z",
//             "__v": 0
//         }
//     ]
// }
const getScoreGraph = async (req, res) => {



    try {
        const user_id = req.user._id;
        //get dates from req.query by es6 object destructuring

        let { startDate, endDate } = req.query;
        console.log(startDate, endDate);


        // 1. check that date is not empty
        if (!(startDate && endDate)) {
            return res.status(400).json({
                status: false,
                message: 'Please ensure you pick two dates',
                payload: {}
            })
        }

        //2. check that date is in the right format
        // console.log({ startDate, endDate });

        //3. Query database using Mongoose
        const scores = await Score.find({
            user_id,

            createdAt: {
                $gt: new Date(startDate),
                $lt: new Date(endDate)
            }
        }).sort({ createdAt: -1 })


        //4. Handle responses
        if (!scores) {
            return res.status(404).json({
                success: false,
                message: 'Could not retrieve scores',
                payload: {}
            })
        }
        res.status(200).json({
            success: true,
            message: 'Graph of your acquired scores.',
            payload: scores
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            payload: {}
        })
    }

}





module.exports = {
    getScore,
    createScore,
    getRank,
    getCurrentRank,
    getScoreGraph
}


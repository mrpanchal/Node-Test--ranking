require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const scoreRoutes = require('./routes/score')
const userRoutes = require('./routes/user')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/score', scoreRoutes)
app.use('/api/user', userRoutes)

// connect to db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to database')
        // listening to port
        app.listen(process.env.PORT, () => {
            console.log('listening for requests on port', process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    }) 
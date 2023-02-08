const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// creating a token
const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '1d' })
}

// Login user API
// Sample Data
// {
//     "email": "Socrates@plato.com",
//     "password": "Thyself!1"
// }

// Success sample Response
// {
//     "success": true,
//     "message": "you logged in successfully",
//     "payload": {
//         "email": "Socrates@plato.com",
//         "password": "Thyself!1",
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzc3MTIwZGYxNWE3MjA5NzY2MDFmNDYiLCJpYXQiOjE2Njg3NDc5NDMsImV4cCI6MTY2ODgzNDM0M30.Zupsx0UCPrC7cxSrDW0fL3SyBBPvmJsSYviuDBHA-_o"
//     }
// }

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({
            success: true,
            message: "you logged in successfully",
            payload: {
                email: email,
                password: password,
                token: token
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

// Signup user
// Sample data
// {
//     "email": "Socrates@plato.com",
//     "password": "Thyself!1",
//     "mobile": "9898989898"
// }

// Success sample response
// {
//     "success": true,
//     "message": "you signed up successfully",
//     "payload": {
//         "email": "Socrates@plato.com",
//         "password": "Thyself!1",
//         "mobile": "9898989898",
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzc3MTIwZGYxNWE3MjA5NzY2MDFmNDYiLCJpYXQiOjE2Njg3NDc3ODksImV4cCI6MTY2ODgzNDE4OX0.sHL4uHrQ7q0uGD52ze9TL8lvvr5YIWTfJV1mrzeUAZo"
//     }
// }
const signupUser = async (req, res) => {
    const { email, password, mobile } = req.body;

    try {
        const user = await User.signup(email, password, mobile)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({
            success: true,
            message: "you signed up successfully",
            payload: {
                email: email,
                password: password,
                mobile: mobile,
                token: token
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

module.exports = {
    loginUser,
    signupUser
}
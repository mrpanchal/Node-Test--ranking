const express = require('express');

//controller functions
const { loginUser, signupUser } = require('../controllers/userController')

const router = express.Router()

// Login user
router.post('/login', loginUser)

// Signup user
router.post('/signup', signupUser)

module.exports = router;

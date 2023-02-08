const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config();

const requireAuth = async (req, res, next) => {
    // verify Authentication
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: 'authorization token required.',
            payload: {}
        })
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.SECRET)

        req.user = await User.findOne({ _id }).select('_id')
        next()
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: 'Request is not authorised',
            payload: {}
        })
    }
}

module.exports = requireAuth;   
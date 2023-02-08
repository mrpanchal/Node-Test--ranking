const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
})

// static signup method
userSchema.statics.signup = async function (email, password, mobile) {

    //validation
    if (!email || !password || !mobile) {
        throw Error('All fields must be filled.')
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid.')
    }

    // if (!validator.isMobilePhone(mobile, ['en-IN'])) {
    //     throw Error('Mobile Number is not valid.')
    // }

    var phoneno = /^\d{10}$/;
    if (!(mobile.match(phoneno))) {
        throw Error("mobile number is not valid");
    }


    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough.')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash, mobile })

    return user
}

// static login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled.')
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error('incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('incorrect password')
    }

    return user;
}

module.exports = mongoose.model('User', userSchema)

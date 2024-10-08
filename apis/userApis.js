const jwt = require('jsonwebtoken');
const User = require('../model/User')

const loginUser = async (req, res) => {
    const userObj = {
        u_name: req.body.u_name,
        u_pwd: req.body.u_pwd
    }
    try {
        const user = await User.findOne(userObj)
        if (!user) {
            res.json({
                'login': 'failure',
                'reason': 'User not found'
            })
            console.log("Log: User not found")
        } else {
            let jwt_token = jwt.sign({u_name: user.u_name}, process.env.JWT_SECRET_KEY, {
                expiresIn: process.env.JWT_EXPIRE_LENGTH
            })
            const options = {
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_LENGTH * 24 * 60 * 60 * 1000),
                sameSite: 'none',
                secure: true,
            };
            res.status(200).cookie('token', jwt_token, options).json({
                'login' : 'success',
                'u_name': user.u_name,
                'token': jwt_token
            })
            console.log("Log: User found")
        }
        
    } catch (error) {
        res.json({ 'login': 'error', 'error': error })
        console.log("Log: Error occured in data fetching")
    }
}

const registerUser = async (req, res) => {
    try {
        const pastUser = await User.find({u_name: req.body.u_name })
        if (pastUser.length > 0) {
            res.json({
                'register': 'failure',
                'reason': 'User already exists'
            })
            console.log("Log: User already exists")
            return;
        }
        const user = new User({
            u_name: req.body.u_name,
            u_pwd: req.body.u_pwd,
            u_email: req.body.u_email,
            u_addr: req.body.u_addr,
            u_contact: req.body.u_contact
        })
        const savedUser = await user.save();
        res.send({
            'register': 'success',
            'user': savedUser
        })
        console.log("Log: User registered")
    }
    catch (error) {
        res.status(400).send({ 'register': 'error', "error": error})
        console.log("Log: Error occured in data insertion")
    }
}

const authenticateUser = async (req, res) => {
    try {
        const { token } = req.cookies
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.find({u_name: decoded.u_name})
        res.json({
            'auth': 'success',
            'u_name': user.u_name
        })
        console.log("Log: User authenticated")
    }
    catch (error) {
        res.json({
            'auth': 'error',
            'error': error
        })
        console.log("Log: User not authenticated")
    }
}

const logoutUser = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    res.json({
        'logout': 'success'
    });
}

module.exports = { loginUser, registerUser, authenticateUser, logoutUser }
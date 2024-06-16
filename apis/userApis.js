const token = require('./token')

const User = require('../model/User')

const loginUser = async (req, res) => {
    const u_name = req.body.u_name
    const u_pwd = req.body.u_pwd
    try {
        const user = await User.find({u_name, u_pwd})
        if (user.length === 0) {
            res.json({
                'login': 'failure'
            })
            console.log("Log: User not found")
        } else {
            let jwt_token = token({ u_name, u_pwd }, new Date().toString())
            res.json({
                'login' : 'success',
                'token': jwt_token
            })
            console.log("Log: User found")
        }
        
    } catch(error) {
        res.json({ 'login': 'error', 'error': error })
        console.log("Log: Error occured in data fetching")
    }
}

const registerUser = async (req, res) => {
    const user = new User({
        u_name: req.body.u_name,
        u_pwd: req.body.u_pwd,
        u_email: req.body.u_email,
        u_addr: req.body.u_addr,
        u_contact: req.body.u_contact
    })
    try {
        const savedUser = await user.save()
        res.send({
            'register': 'success',
            'user': savedUser
        })
        console.log("Log: User registered")
    }
    catch (error) {
        res.status(400).send({ 'register': 'success', "error": error})
        console.log("Log: Error occured in data insertion")
    }
}

const AuthenticateUser = async (req, res) => {
    const token = req.header('Authorization')
    if (!token) {
        res.send({
            'auth': 'failure'
        })
    } else {
        try {
            const verified = jwt.verify(token, new Date().toString())
            req.user = verified
            res.send({
                'auth': 'success',
                'user': verified
            })
        } catch (error) {
            res.send({
                'auth': 'error',
                'error': error
            })
        }
    }
    
}

module.exports = { loginUser, registerUser, AuthenticateUser }
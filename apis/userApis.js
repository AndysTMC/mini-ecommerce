const token = require('./token')

const User = require('../model/User')

const loginUser = async (req, res) => {
    const u_name = req.body.u_name
    const u_pwd = req.body.u_pwd
    try {
        const user = await User.find({u_name, u_pwd})
        if (user.length === 0) {
            res.json({
                'auth': 'failure'
            })
            console.log("Log: User not found")
        }
        let jwt_token = token({ u_name, u_pwd }, new Date().toString())
        res.json({
            'auth' : 'success',
            'token': jwt_token
        })
        console.log("Log: User found")
    } catch(error) {
        res.json({ 'error': 'Error occured in data fetching' })
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
            'registration': 'success',
            'user': savedUser
        })
        console.log("Log: User registered")
    }
    catch (error) {
        res.status(400).send({"error": "Error occured in data insertion"})
        console.log("Log: Error occured in data insertion")
    }
}

module.exports = { loginUser, registerUser }
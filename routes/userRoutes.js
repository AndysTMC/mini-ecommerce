//import express module
const express = require('express')
//create router instance
const router = express.Router()

//import userApi
const userApi = require('../apis/userApis')

//login user
router.post('/login', userApi.loginUser)

//register user
router.post('/register', userApi.registerUser)

//export router
module.exports = router
//import express module
const express = require('express')
//create router instance
const router = express.Router()

//import userApi
const cartApi = require('../apis/cartApis')

//insert to cart
router.post('/insert', cartApi.insert_to_cart)

//update to cart
router.put('/update', cartApi.update_to_cart)

//delete from cart
router.delete('/delete', cartApi.delete_from_cart)

//fetch from cart
router.get("/fetch", cartApi.fetch_cart)

//export router
module.exports = router
//import express module
const express = require('express')
//create router instance
const router = express.Router()
//import productApi
const productApi = require('../apis/productApis')
//fetch all records
router.get("/fetch_all", productApi.fetch_all_products)
//fetch record
router.get("/fetch", productApi.fetch_product)
//insert record
router.post("/insert", productApi.insert_product)
//update record
router.put("/update", productApi.update_product)
//delete record
router.delete("/delete", productApi.delete_product)
//export router
module.exports = router

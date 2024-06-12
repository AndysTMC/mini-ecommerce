const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    p_id: Number,
    p_name: String,
    p_cost: Number,
    p_cat: String,
    p_img: String,
    p_desc: String
})

module.exports = mongoose.model("Product", productSchema)
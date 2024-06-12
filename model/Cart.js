
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    p_id: Number,
    p_img: String,
    p_cost: Number,
    p_qty: Number,
    u_name: String
})

module.exports = mongoose.model("Cart", cartSchema)
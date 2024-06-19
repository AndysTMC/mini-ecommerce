//import db schema
const Cart = require('../model/Cart')
const Product = require('../model/Product')


const fetch_cart = async (req, res) => {
    const u_name = req.u_name
    try {
        const cart = await Cart.find({u_name: u_name})
        res.json({
            'fetch' : 'success',
            'cart' : cart
        })
        console.log("Log: Cart found")
    } catch(error) {
        res.json({ 'error': 'Error occured in data fetching' })
        console.log("Log: Error occured in data fetching")
    }
}

const insert_to_cart = async (req, res) => {
    console.log("Log: Inserting product to cart")
    const reference = {
        u_name: req.u_name,
        p_id: req.body.p_id,
    }
    const product = await Product.findOne({p_id: reference.p_id})
    const cart = await Cart.findOne(reference)
    if (!cart && product) {
        const cartProduct = new Cart({
            ...reference,
            p_img: product.p_img,
            p_cost: product.p_cost,
            p_qty: 1
        })
        try {
            const savedCart = await cartProduct.save()
            res.json({
                'insert': 'success',
                'cart': savedCart
            })
            console.log("Log: Product added to cart")
        } catch (error) {
            res.json({'error': 'Error occured in data insertion' })
            console.log("Log: Error occured in data insertion")
        }
    } else {
        res.json({
            'insert': 'failure'
        })
        console.log("Log: Product already exists in cart")
    }

}

const update_cart = async (req, res) => {
    const reference = {
        u_name: req.u_name,
        p_id: req.body.p_id,
    }
    const qty_change = req.body.qty_change;
    const cart = await Cart.findOne(reference)
    if (cart) {
        const updatedCart = await Cart.updateOne(reference, { $inc: { p_qty: qty_change } })
        if (cart.p_qty == 1 && qty_change == -1) {
            const deletedCart = await Cart.deleteOne(reference)
            console.log("Log: Product deleted from cart")
        }
        res.json({
            'update': 'success',
            'cart': updatedCart
        })
        console.log("Log: Product quantity updated in cart")
    } else {
        res.json({
            'update': 'failure'
        })
        console.log("Log: Product not found in cart")
    }
}

const delete_from_cart = async (req, res) => {
    const reference = {
        u_name: req.u_name,
        p_id: req.query.p_id,
    }
    console.log(reference)
    const deletedCart = await Cart.deleteOne(reference)
    console.log(deletedCart)
    if(deletedCart.deletedCount === 0) {
        res.json({
            'delete': 'failure'
        })
        console.log("Log: Product not found in cart")
    }
    res.json({
        'delete': 'success',
        'cart': deletedCart
    })
    console.log("Log: Product deleted from cart")
}

module.exports = {
    fetch_cart,
    insert_to_cart,
    update_cart,
    delete_from_cart
}
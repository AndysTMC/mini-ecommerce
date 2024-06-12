//import db schema
const Cart = require('../model/Cart')


const fetch_cart = async (req, res) => {
    const u_name = req.body.u_name
    try {
        const cart = await Cart.find({u_name})
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
    const reference = {
        u_name: req.body.u_name,
        p_id: req.body.p_id,
    }
    const data = {
        p_img: req.body.p_img,
        p_cost: req.body.p_cost
    }
    const cart = await Cart.find(reference)
    if (cart.length == 0) {
        const cartProduct = new Cart({
            ...reference,
            ...data,
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

const update_to_cart = async (req, res) => {
    const reference = {
        u_name: req.body.u_name,
        p_id: req.body.p_id,
    }
    const cart = await Cart.find(reference)
    if (cart.length > 0) {
        const updatedCart = await Cart.updateOne(reference, { $inc: { p_qty: 1 } })
        if(updatedCart.nModified === 0) {
            res.json({
                'update': 'failure'
            })
            console.log("Log: Product not found in cart")
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
        u_name: req.body.u_name,
        p_id: req.body.p_id,
    }
    // check if product with the user already exists in cart
    const cart = await Cart.find(reference)
    // if product already exists, update the quantity else delete the product
    if (cart.length >= 1) {
        // store the value of p_qty in a variable
        const p_qty = cart[0].p_qty
        if(p_qty == 1)  {
            const deletedCart = await Cart.deleteOne(reference)
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
        } else {
            const updatedCart = await Cart.updateOne(reference, { $inc: { p_qty: -1 } })
            if(updatedCart.nModified === 0) {
                res.json({
                    'update': 'failure'
                })
                console.log("Log: Product not found in cart")
            }
            res.json({
                'delete': 'success',
                'cart': updatedCart
            })
            console.log("Log: Product quantity updated in cart")
        }
    } else {
        res.json({
            'delete': 'failure'
        })
        console.log("Log: Product not found in cart")
    }
}


module.exports = {
    fetch_cart,
    insert_to_cart,
    update_to_cart,
    delete_from_cart
}
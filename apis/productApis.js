//import db schema
const Product = require('../model/Product')

const fetch_product = async (req, res) => {
    const p_id = req.body.p_id
    try {
        const product = await Product.find({p_id})
        res.json({
            'fetch' : 'success',
            'product' : product
        })
        console.log("Log: Product fetched")
    } catch(error) {
        res.json({ 'error': 'Error occured in data fetching' })
        console.log("Log: Error occured in data fetching")
    }
}

const fetch_all_products = async (req, res) => {
    try {
        const products = await Product.find()
        res.json({
            'fetch_all' : 'success',
            'products' : products
        })
        console.log("Log: All products fetched")
    } catch(error) {
        res.json({ 'error': 'Error occured in data fetching' })
        console.log("Log: Error occured in data fetching")
    }
}

const insert_product = async (req, res) => {
    const product = new Product({
        p_id: req.body.p_id,
        p_name: req.body.p_name,
        p_img: req.body.p_img,
        p_cost: req.body.p_cost,
        p_cat: req.body.p_cat,
        p_desc: req.body.p_desc
    })
    try {
        const savedProduct = await product.save()
        res.send({
            'insert': 'success',
            'product': savedProduct
        })
        console.log("Log: Product inserted")
    }
    catch (error) {
        res.status(400).send({"error": "Error occured in data insertion"})
        console.log("Log: Error occured in data insertion")
    }
}

const update_product = async (req, res) => {
    const p_id = req.body.p_id;
    const newData = {
        p_name: req.body.p_name,
        p_img: req.body.p_img,
        p_cost: req.body.p_cost,
        p_cat: req.body.p_cat,
        p_desc: req.body.p_desc
    };

    try {
        const updateProduct = await Product.updateOne(
            { p_id: p_id },
            { $set: newData }
        );
        
        if (updateProduct.modifiedCount !== 0) {
            res.send({ 'update': 'success' });
            console.log("Log: Product updated")
        } else {
            res.send({ 'update': 'failure' });
            console.log("Log: Product not updated")
        }
    } catch (error) {
        res.status(400).send(error);
        console.log("Log: Error occured in data updation")
    }
};


const delete_product = async (req, res) => {
    let p_id = req.body.p_id
    try {
        const deletedProduct = await Product.deleteOne({p_id})
        if(deletedProduct.deletedCount != 0) {
            res.send({'delete':'success'})
            console.log("Log: Product deleted")
        } else {
            res.send({'delete':'failure'})
            console.log("Log: Product not deleted")
        }
    } catch(error) {
        res.status(400).send({"error": "Error occured in data deletion"})
        console.log("Log: Error occured in data deletion")
    }
}


module.exports = {
    fetch_product,
    fetch_all_products,
    insert_product,
    update_product,
    delete_product
}
const productModel = require("../models/productModel");


const createProduct = async function (req, res) {

    let product = req.body
    let productData = await productModel.create(product)
    res.send( {msg : productData})

}

module.exports.createProduct = createProduct
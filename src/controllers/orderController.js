const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel')


const createOrder = async function (req, res) {
    let data = req.body
    let userId = data.userId
    let productId = data.productId
    if (!userId) {
        return res.send({ msg: "userId is mandatory" })
    }
    else if (!productId) {
        return res.send({ msg: "productId is mandatory" })
    }

    let UserId = await userModel.findById(userId)
    let ProductId = await productModel.findById(productId)

    if (!UserId) {
        return res.send({ msg: "UserId is not valid" })
    }
    else if (!ProductId) {
        return res.send({ msg: "ProductId is not valid" })
    }


    let token = req.headers.isfreeappuser
    let value = 0
    if (token === 'true') {
        data.amount = value
        data["isFreeAppUser"] = token
        let orderData = await orderModel.create(data)
        res.send({msg : orderData})
    }
    else if(UserId.balance >= ProductId.price){

        await userModel.findOneAndUpdate({_id : userId},
            {$set : {balance : UserId.balance - ProductId.price}})
            data["amount"] = ProductId.price
            data["isFreeAppUser"] = token

            let orderData = await orderModel.create(data)
            res.send({msg : orderData})
    }
    else{
        res.send({msg : "insufficient balance!"})
    }

}


module.exports.createOrder = createOrder
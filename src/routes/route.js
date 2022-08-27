const { query } = require('express');
const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderController")
const productController = require("../controllers/productController")
const userController = require("../controllers/userController")
const middleWare = require('../middlewares/userMiddleware')


router.get('/test-me', function(req, res){
    res.send("My first api!")
})


router.post('/createProduct', productController.createProduct)

router.post('/createUser', middleWare.checkUser, userController.createUser)

router.post('/createOrder', middleWare.checkUser, orderController.createOrder)


module.exports = router;
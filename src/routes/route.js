const { query } = require('express');
const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const middleWare = require('../middleware/auth')


router.get('/test-me', function(req, res){
    res.send("My first api!")
})


router.post('/createUser', userController.createUser)

router.post('/login', userController.loginUser)

router.get('/users/:userId', middleWare.validation, userController.getUserData)

router.put('/users/:userId', middleWare.validation, userController.updateUserData)

router.delete('/users/:userId', middleWare.validation, userController.deleteUserData)



module.exports = router;
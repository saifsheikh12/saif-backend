const { query } = require('express');
const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")


router.get('/test-me', function(req, res){
    res.send("My first api!")
})


router.post('/createBook', authorController.createBook)

router.post('/authors', authorController.authors)

router.get('/listBook', authorController.listBook)

router.get('/updateBook', authorController.updateBook)

router.get('/bookRange', authorController.bookRange)

module.exports = router;
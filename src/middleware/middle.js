const jwt = require("jsonwebtoken");
const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const mongoose = require("mongoose");


const authentication = async function (req, res, next) {
  try {
    let token = req.headers['x-api-key']
    if (!token) {
      return res.status(404).send({ status: false, message: "token must be present" })
    }

    let decodedToken = jwt.verify(token, "rahul_satyajit_mdsaifuddin_anul")
    if (!decodedToken) {
      return res.status(401).send({ status: false, message: "token is invalid" })
    }
    if (Date.now() > (decodedToken.exp) * 1000) {
      return res.status(440).send({ status: false, message: "Session expired! Please login again." })
    }
    req.token = decodedToken
    next()
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}

const authorization = async function (req, res, next) {
  try {
    let bookId = req.params.bookId
    if(!mongoose.isValidObjectId(bookId)){
      return res.status(400).send({ status: false, message: "invalid bookId" });
    }
    let findBook = await bookModel.findById(bookId);
    if (!findBook) {
      return res.status(404).send({ status: false, message: "bookId not exist" });
    }

    if (req.token.userId != findBook.userId) {
      return res.status(403).send({ status: false, message: "user is not authorized to access this data" });
    }

    next()
  }
  catch (err) {
    return res.status(500).send({ status:false, message: err.message })
  }
}
const authorizationForCreateBook = async function (req, res, next) {
  try {
    let userId = req.body.userId
    if(!mongoose.isValidObjectId(userId)){
      return res.status(400).send({ status: false, message: "invalid userId" });
    }
    if (req.token.userId != userId) {
      return res.status(403).send({ status: false, message: "user is not authorized to create this data" });
    }

    next()
  }
  catch (err) {
    return res.status(500).send({ status:false, message: err.message })
  }
}
module.exports = { authentication, authorization, authorizationForCreateBook };
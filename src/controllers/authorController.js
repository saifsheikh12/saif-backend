const authorModel = require('../models/authorModel');
const bookModel = require("../models/bookModel")


const createBook = async function (req, res) {
    let data = req.body
    let savedData = await bookModel.create(data)
    res.send({ msg: savedData })
}


const authors = async function (req, res) {
    let data = req.body
    let savedData = await authorModel.create(data)
    res.send({ msg: savedData })
}


const listBook = async function (req, res) {
    let findAuthor = await authorModel.find({ author_name: "Chetan Bhagat" })
    let findBook = await bookModel.find({ $eq :findAuthor[0].author_Id })
    res.send({ msg: findBook })
}


const updateBook = async function (req, res) {
    let bookPrice = await bookModel.findOneAndUpdate(
        { bookName: "Two states" },
        { $set: { prices: "100" } },
        { new: true })
    let updatePrice = bookPrice.prices
    let authorDetails = await authorModel.find({ author_id: bookPrice }).select({ author_name: 1, _id: 0 })
    res.send({ msg: authorDetails, updatePrice })
}


const bookRange = async function (req, res) {
    let range = await bookModel.find({ prices: { $gte: 50, $lte: 100 } })
    let map = range.map(x => x.author_id)
    let result = await authorModel.find({ author_id: map }).select({ author_name: 1, _id: 0 })
    res.send({ msg: result })

}


module.exports.createBook = createBook
module.exports.authors = authors
module.exports.listBook = listBook
module.exports.updateBook = updateBook
module.exports.bookRange = bookRange
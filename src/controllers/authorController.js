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
    let author = await authorModel.find({ author_name: "Chetan Bhagat" })
    let findBook = await bookModel.find({ author_id: {$eq: author[0].author_id}})
    res.send({ msg: findBook })
}


const updateBook = async function (req, res) {
    let bookprice = await bookModel.findOneAndUpdate(
        {name: "Two states" },
     { price: 100 },
        { new: true })
    let updateprice = bookprice.price
    let authorupdate = await authorModel.find({ author_id:{$eq: bookprice.author_id}}).select({ author_name: 1, _id: 0 })
    res.send({ msg: authorupdate, updateprice })
}


const bookRange = async function (req, res) {
    let range = await bookModel.find({ prices: { $gte: 50, $lte: 100 } })
    let map = range.map(x => x.author_id);
    let NewBooks = await authorModel.find({ author_id: map }).select({ author_name: 1, _id: 0 })
    res.send({ msg: NewBooks })

}


module.exports.createBook = createBook
module.exports.authors = authors
module.exports.listBook = listBook
module.exports.updateBook = updateBook
module.exports.bookRange = bookRange
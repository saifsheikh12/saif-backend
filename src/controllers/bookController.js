const { find } = require("../models/newAuthor")
const authorModel = require("../models/newAuthor")
const bookModel= require("../models/newBook")
const publisherModel=require("../models/newPublisher")

const createBook= async function (req, res) {
    let book = req.body
    let authorDataId = book.author
    if(!authorDataId){
res.send({status:false,msg:"AuthorId is mandatory"})
    }
    let MyauthorId=await authorModel.findById(authorDataId)
    if(!MyauthorId){
        res.send({status:false,msg:"AuthorId didnt Match"})
}
let publishDataId=book.publisher
if(!publishDataId){
    res.send({status:false,msg:"publisherId is mandatory"})
}
let MYpublishId=await publisherModel.findById(publishDataId)
if(!MYpublishId){
    res.send({status:false,msg:"publisher id didnt match"})
}

    
    let bookCreated = await bookModel.create(book)
    res.send({data: bookCreated})
}



const getAllBook = async function (req, res) {
    let specificBook = await bookModel.find().populate(['author','publisher'])
    res.send({data: specificBook})

}
let updateBook = async function (req, res) {
    let publisher = await publisherModel.find({ 'name': { $in: ['Penguin', 'HarperCollins'] } })
    let publisherID = publisher.map(function (x) {
        return x._id.toString()
    })
    let books = await bookModel.updateMany(
        {publisher: publisherID },
        { isHardCover: true })

    res.send(books)
    }
const updatePrice = async function(req,res){
    let objectId = await authorModel.find({rating:{$gt:3.5}})
    let updatedPrice = await bookModel.updateMany(
        {books: {$in: objectId}}, 
        {$inc: {price : +10}},
        {new : true})
    res.send({msg : updatedPrice})
}

   

module.exports.createBook= createBook
module.exports.getAllBook = getAllBook
module.exports.updateBook=updateBook
module.exports.updatePrice=updatePrice

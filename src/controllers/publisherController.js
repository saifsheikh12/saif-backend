const publisherModel=require("../models/newPublisher")

const createPublish= async function (req, res) {
    let book = req.body
    let bookCreated = await publisherModel.create(book)
    res.send({data: bookCreated})
}


module.exports.createPublish=createPublish


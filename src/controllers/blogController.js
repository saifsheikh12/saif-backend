const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const moment = require("moment");
const today = moment();

const createBlog = async function (req, res) {
    try {
        let blogData = req.body;
        let authorId = req.body.authorId;
        if (!authorId) return res.status(400).send({ status: false, msg: "AuthorId is A Mandatory Field" })
        let author = await authorModel.findById(authorId);
        if (!author) return res.status(400).send({ status: false, msg: "Please Confirm The AuthorId,No Author Found With This Id" })
        req.body.createdAt = today.format()
        if(blogData.isPublished===true)blogData.publishedAt=today.format();
        if(blogData.isDeleted===true)blogData.deletedAt=today.format();
        let savedBlog = await blogModel.create(blogData);
        return res.status(201).send({ status: true, data: savedBlog })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports.createBlog = createBlog
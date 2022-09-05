const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const moment = require("moment");
const { findOneAndUpdate } = require("../models/authorModel");
const today = moment();

const createBlog = async function (req, res) {
    try {
        let blogData = req.body;
        if (!blogData) return res.status(400).send({ status: false, msg: "Request Body Cant be Empty" });
        let authorId = req.body.authorId;
        if (!authorId) return res.status(400).send({ status: false, msg: "AuthorId is A Mandatory Field" })
        let author = await authorModel.findById(authorId);
        if (!author) return res.status(400).send({ status: false, msg: "Please Confirm The AuthorId,No Author Found With This Id" })
        req.body.createdAt = today.format()
        if (blogData.isPublished === true) blogData.publishedAt = today.format();
        if (blogData.isDeleted === true) blogData.deletedAt = today.format();
        let savedBlog = await blogModel.create(blogData);
        return res.status(201).send({ status: true, data: savedBlog })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

// =============================================================================================================================================
const getBlogs = async function (req, res) {
    try {
        let data = req.query;
        data.isDeleted = false;
        data.isPublished = true;
        let blog = await blogModel.find(data);
        if (blog.length < 1) return res.status(404).send({ status: false, msg: "No Blogs Found Matching these Criteria" });
        return res.status(200).send({ status: true, data: blog })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}




// =========================================================================================================================================
const updateBlogs = async function (req, res) {
    let blogId = req.params.blogId;
    if (!blogId) return res.status(400).send({ status: false, msg: "BlogId is a Mandatory Field" })
    let blog = await blogModel.find({ _id: blogId, isDeleted: false });
    if (blog.length<1) return res.status(404).send({ status: false, msg: "No Blog Found,Please Confirm Id,or the Blog is deleted!!" });
    let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { title: req.body.title, body: req.body.body, $push: { tags: req.body.tags, subcategory: req.body.subcategory } }, { new: true });
    res.send({ data: updatedBlog })

}



module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs
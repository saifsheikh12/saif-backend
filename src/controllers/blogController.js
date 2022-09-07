const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const moment = require("moment");
const { findOneAndUpdate } = require("../models/authorModel");
const today = moment();










// ===========================================ROUTE HANDLER FOR CREATEBLOG API======================================================================================================


const createBlog = async function (req, res) {
    try {
        let blogData = req.body;
        if (!blogData) return res.status(400).send({ status: false, msg: "Request Body Cant be Empty" });
        if (!blogData.title) return res.status(400).send({ status: false, msg: "Title is a Mandatory Field" });
        if (!blogData.body) return res.status(400).send({ status: false, msg: "Body is a Mandatory Field" });
        if (!blogData.category) return res.status(400).send({ status: false, msg: "Category is a Mandatory Field" });


        let authorId = req.body.authorId;
        if (!authorId) return res.status(400).send({ status: false, msg: "AuthorId is A Mandatory Field" })
        let author = await authorModel.findById(authorId);
        if (!author) return res.status(400).send({ status: false, msg: "Please Confirm The AuthorId,No Author Found With This Id" })
        let savedBlog = await blogModel.create(blogData);
        return res.status(201).send({ status: true, data: savedBlog })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

// =============================================ROUTE HANDLER FOR FETCH BLOGS API================================================================================================


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




// ==============================================ROUTE HANDLER FOR UPDATE BLOGS API===========================================================================================


const updateBlogs = async function (req, res) {
    try {
        let { title, tags, body, subcategory } = req.body;
        let obj = {};
        obj.isPublished = true;
        obj.publishedAt = today.format();
        let pushObj = {};
        if (title) obj.title = title;
        if (tags) pushObj.tags = tags;
        if (body) obj.body = body;
        if (subcategory) pushObj.subcategory = subcategory;
        let updatedBlog = await blogModel.findOneAndUpdate({ _id: req.blogId }, { $set: obj, $push: pushObj }, { new: true });
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


// ==============================================ROUTE HANDLER FOR DELETE BLOGS BY PATH PARAMS API ============================================================================================================


const deleteBlogByParams = async function (req, res) {
    try {

        let deletedBlog = await blogModel.findOneAndUpdate({ _id: req.blogId }, { isDeleted: true, deletedAt: today.format() }, { new: true });
        return res.status(200)
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}

// ==============================================ROUTE HANDLER FOR DELETE BLOGS BY QUERY PARAMS API==============================================================================================

const deleteByQuery = async function (req, res) {
    try {

        let reqQuery = req.query;
        if (Object.keys(reqQuery).length == 0) return res.status(400).send({ status: false, msg: "Please Provide Query Params Filter" });
        reqQuery.isDeleted = false;
        if (reqQuery.authorId === "" || reqQuery.category === "" || reqQuery.tags === "" || reqQuery.subcategory === "" || reqQuery.isPublished === "") return res.status(400).send({ status: false, msg: "Query Filters Cant Be Blank" })
        let deletedBlog = await blogModel.updateMany(reqQuery, { isDeleted: true }, { new: true });
        if (!deletedBlog) return res.status(404).send({ status: false, msg: "No Such BLog Or the blog is Deleted" });
        return res.status(200).send({ status: true, data: deletedBlog })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}




module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deleteBlogByParams = deleteBlogByParams;
module.exports.deleteByQuery = deleteByQuery;
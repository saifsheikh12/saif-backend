const blogModel = require("../models/blogModel");
const jwt = require("jsonwebtoken");


const mid1 = async function (req, res, next) {
    try {
        let blogId = req.params.blogId;
        if (!blogId) return res.status(400).send({ status: false, msg: "BlogId is a Mandatory Field" });
        let blog = await blogModel.find({ _id: blogId });
        if (blog.length < 1) return res.status(404).send({ status: false, msg: "No Blog Found,Please Confirm The BlogId" });
        let blog1 = await blogModel.find({ _id: blogId, isDeleted: false });
        if (blog1.length < 1) return res.status(404).send({ status: false, msg: "No Blog Found,Its been deleted" });
        req.blogId = blogId,
            next();
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



const authenticationMidd = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {
            token = req.headers["x-Api-key"]
        } if (!token) return res.status(403).send({ status: false, msg: "Request Is Missing A Mandatory Header" })
        let decodedToken = jwt.verify(token, "ZanduBalm");
        if (!decodedToken) return res.status(403).send({ status: false, msg: "InValid Token" });
        req["x-api-key"] = decodedToken;
        next();
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}


const authorisationMidd = async function (req, res, next) {
    try {
        let token = req["x-api-key"];
        if (req.body.authorId) { 
            if (req.body.authorId != token.authorid) return res.status(401).send({ status: false, msg: "UnAuthorised" }); next() };
        if (req.params.authorId) { 
            if (req.params.authorId != token.authorid) return res.status(401).send({ status: false, msg: "UnAuthorised" }); next() };
        if (req.params.blogId) { 
            let blog = await blogModel.findById(req.params.blogId).select({ authorId: 1 }); if (blog.authorId != token.authorid) return res.status(401).send({ status: false, msg: "UnAuthorised" }); next() };
        if (req.query.authorId) { 
            if (req.query.authorId != token.authorid) return res.status(401).send({ status: false, msg: "UnAuthorised" }); next() };

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}





module.exports.mid1 = mid1;
module.exports.authenticationMidd = authenticationMidd;
module.exports.authorisationMidd = authorisationMidd;
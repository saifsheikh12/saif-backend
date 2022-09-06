const authorModel = require("../models/authorModel");
const validator = require("email-validator");
const jwt = require("jsonwebtoken")

const createAuthor = async function (req, res) {
    try {
        let authorData = req.body;
        if (!authorData.fname) return res.status(400).send({ status: false, msg: "FirstName Is Mandatory" });
        if (typeof (authorData.fname) !== "string") return res.status(400).send({ status: false, msg: "Invalid First Name" });
        if (!authorData.lname) return res.status(400).send({ status: false, msg: "LastName Is Mandatory" });
        if (typeof (authorData.lname) !== "string") return res.status(400).send({ status: false, msg: "Invalid Last Name" });
        if (!authorData.title) return res.status(400).send({ status: false, msg: "Title Is A Mandatory Field" });
        if (authorData.title !== "Mr" && authorData.title !== "Miss" && authorData.title !== "Mrs") return res.status(400).send({ status: false, msg: "Unacceptable Title" })
        let validEmail = validator.validate(authorData.email);
        if (validEmail === false) return res.status(400).send({ status: false, msg: "Invalid Email" });
        if (!authorData.password) return res.status(400).send({ status: false, msg: "Password is Mandatory" })
        let savedData = await authorModel.create(authorData);
        return res.status(201).send({ status: true, data: savedData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const login = async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    if (!email) return res.status(400).send({ status: false, msg: "Please Input Email" });
    if (!password) return res.status(400).send({ status: false, msg: "Please Input Password" });
    let authorData = await authorModel.findOne({ email: email, password: password });
    if (!authorData) return res.status(400).send({ status: false, msg: "No User Found With These Credentials" });
    let token = jwt.sign({ authorid: authorData._id, email: authorData.email }, "ZanduBalm");
    res.setHeader("x-api-key", token);
    return res.status(200).send({ status: true, data: { token: token } })
}







module.exports.createAuthor = createAuthor;
module.exports.login = login;
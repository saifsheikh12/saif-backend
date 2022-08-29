const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')


const createUser = async function (req, res) {

    let data = req.body
    let savedData = await userModel.create(data)
    res.send({ msg: savedData })
}


const loginUser = async function (req, res) {
    let userName = req.body.emailId
    let password = req.body.password
    let user = await userModel.findOne({ emailId: userName, password: password })
    if (!user) {
        return res.send({ status: false, msg: "userName or password is incorrect" })
    }
    let token = await jwt.sign({ userId: user._id.toString() }, "saif-plutonium")
    res.send({ status: true, data: token })
}



const getUserData = async function (req, res) {

    let userId = req.params.userId
    let userDetails = await userModel.findById(userId)
    if (!userDetails) {
        return res.send({ status: false, msg: "userId does not exist!" })
    }
    res.send({ status: false, data: userDetails })
}



const updateUserData = async function (req, res) {

    let userId = req.params.userId
    let userDetails = await userModel.findById(userId)
    if (!userDetails) {
        return res.send({ status: false, msg: "userId does not exist!" })
    }

    let userData = req.body
    let updatedUser = await userModel.findOneAndUpdate(
        { _id: userId },
        userData,
        { new: true })
    res.send({ status: true, data: updatedUser, })
}



const deleteUserData = async function (req, res) {

    let userId = req.params.userId
    let userDetails = await userModel.findById(userId)
    if (!userDetails) {
        return res.send({ status: false, msg: "userId does not exist!" })
    }
    let updateUser = await userModel.findOneAndUpdate(
        { _id: userId },
        { isDeleted: true },
        { new: true }
    )
    res.send({ status: true, data: updateUser })
}


module.exports.createUser = createUser
module.exports.loginUser = loginUser
module.exports.getUserData = getUserData
module.exports.updateUserData = updateUserData
module.exports.deleteUserData = deleteUserData
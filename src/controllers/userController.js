const userModel = require('../models/userModel')

const createUser= async function(req, res) {

    let user = req.body
    let token = req.headers.isfreeappuser
    user["isFreeAppUser"] = token
    let userData = await userModel.create(user)
    res.send({msg : userData})
    }

module.exports.createUser = createUser
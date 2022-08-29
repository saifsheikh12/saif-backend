const jwt = require('jsonwebtoken')


const validation = async function(req,res,next){

    let token = req.headers["x-auth-token"]
    if (!token) {
        return res.send({ status: false, msg: "token is mandatory" })
    }
    let decode = await jwt.verify(token, "saif-plutonium")
    if (!decode) {
        return res.send({ status: false, msg: "This token is not valid" })
    }
    else {
        next()
    }
}


module.exports.validation = validation
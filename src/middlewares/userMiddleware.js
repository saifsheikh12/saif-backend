
const checkUser = function(req,res,next){
    let tokenHeader = req.headers["isfreeappuser"]
    if(!tokenHeader){
        return res.send ({msg : "isFreeAppUser is required"})
    }else{
        next()
    }
}


module.exports.checkUser = checkUser
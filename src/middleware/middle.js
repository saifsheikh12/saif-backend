
const jwt = require("jsonwebtoken");



let authentication=async function(req,res,next){
    let token = req.headers["x-project-1"];
        if (!token) {
            token = req.headers["x-project-1"]}
    
    if(!token)return res.status(403).send({status:false,msg:"Invalid heades"})

    let decoded=jwt.verify(token,"Project-3",function(err,decoded){
        if (err) {
            console.log(err)
            
        }
      })



    if(!decoded)return res.status(403).send({status:false,msg:"invalid token"})
    req.token=decoded;
    next();

}
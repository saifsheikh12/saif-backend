const authorModel = require("../models/authorModel");
const validator = require("email-validator");

const createAuthor = async function(req,res){
try{let authorData = req.body;
let validEmail = validator.validate(authorData.email);
if(validEmail===false)return res.status(400).send({status:false,msg:"Invalid Email"});
let savedData = await authorModel.create(authorData);
return res.status(201).send({status:true,data:savedData})}
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}



module.exports.createAuthor = createAuthor;
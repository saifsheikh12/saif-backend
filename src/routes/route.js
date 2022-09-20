const express =require("express");
const router = express.Router();




router.all("/*/",async function(req, res){
    res.status(404).send({status:false, msg: "page not found"})
})

module.exports= router;
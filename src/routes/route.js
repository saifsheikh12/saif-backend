const express =require("express");
const router = express.Router();
const userController=require("../controller/userController")


router.post("/register",userController.createUser)
router.post("/login",userController.login)

router.all("/*/",async function(req, res){
    res.status(404).send({status:false, msg: "page not found"})
})

module.exports= router;
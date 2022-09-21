const express =require("express");
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")


router.post("/register",userController.createUser)
router.post("/login",userController.login)
router.post("/books",bookController.createBook)
router.get("/books",bookController.getBooks)

router.all("/*/",async function(req, res){
    res.status(404).send({status:false, msg: "page not found"})
})

module.exports= router;
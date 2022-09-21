const express =require("express");
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const middleware= require("../middleware/middle")

router.post("/register",userController.createUser)
router.post("/login",userController.login)
router.post("/books",middleware.authentication,middleware.authorization ,bookController.createBook)
router.get("/books",middleware.authentication,middleware.authorization,bookController.getBooks)

router.all("/*/",async function(req, res){
    res.status(404).send({status:false, msg: "page not found"})
})

module.exports= router;
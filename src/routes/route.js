const express=require("express")

//import urlContrller from "../controllers/urlControllers.js"
const urlController=require("../controllers/urlControllers")
const router = express.Router(); 

router.post("/url/shorten",urlController.createUrl)
router.get("/:urlCode",urlController.getUrl)

router.all("/*", function (req ,res){
    res.status(400).send("Invalid request........!!!")
})

module.exports = router
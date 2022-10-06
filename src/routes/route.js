const express=require("express")
const urlController=require("../controllers/urlControllers")
const router = express.Router(); 


router.post("/shorten",urlController.createUrl)
router.get("/:urlCode",urlController.getUrl)

router.all("/*", function (req ,res){
    res.status(400).send("Invalid request........!!!")
})

module.exports = router



 
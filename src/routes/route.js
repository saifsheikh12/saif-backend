const express = require('express');

const router = express.Router();

const urlController=require("../controller/urlController")

router.post("/shortnerUrl",urlController.shortnerUrl)
router.get("/getUrl",urlController.getUrl)


router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
});

module.exports = router;
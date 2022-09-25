const express =require("express");
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController= require("../controller/reviewController")
const middleware= require("../middleware/middle")
//--------------------------user api-----------------------------------//
router.post("/register",userController.createUser)

router.post("/login",userController.login)
//---------------------------books api---------------------------------//
router.post("/books",bookController.createBook)

router.get("/books",bookController.getBooksByQuery)

router.get("/books/:bookId", bookController.getBookById);

router.put("/books/:bookId",bookController.updateBooks)

router.delete("/books/:bookId",bookController.deleteBook);

//----------------------------book review api--------------------------//

router.post("/books/:bookId/review", reviewController.BookReview)

router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId', reviewController.deleteBookReview);

//router.delete('/books/:bookId', middleware.authentication, bookController.deleteBook);

router.all("/*/",async function(req, res){
    res.status(404).send({status:false, message: "page not found"})
})

module.exports= router;
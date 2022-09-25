const express =require("express");
const router = express.Router();
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController= require("../controller/reviewController")
const middleware= require("../middleware/middle")
//--------------------------user api-----------------------------------//
router.post("/register",userController.createUser)

router.post("/login",userController.loginUser)
//---------------------------books api---------------------------------//
router.post("/books",middleware.authentication,middleware.authorizationForCreateBook, bookController.createBook)

router.get("/books",middleware.authentication, bookController.getBooksByQuery)

router.get("/books/:bookId",middleware.authentication,middleware.authorization, bookController.getBookById)

router.put("/books/:bookId",middleware.authentication,middleware.authorization,bookController.updateBooks)

router.delete("/books/:bookId",middleware.authentication,middleware.authorization,bookController.deleteBook)

//----------------------------book review api--------------------------//

router.post("/books/:bookId/review", reviewController.BookReview)

router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId', reviewController.deleteBookReview);

router.all("/*/",async function(req, res){
    res.status(400).send({status:false, message: "page not found"})
})

module.exports= router;
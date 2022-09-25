const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel.js")
const mongoose = require("mongoose")


//-------------------------------------------common isvalid Function--------------------------//
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}
const isValidBody = function (value) {
    if (Object.keys(value).length == 0) return true
    return false
}
//--------------------------------------------createBook Review---------------------------------//
let createBookReview = async function (req, res) {
    try {
        let reviewData = req.body;

        if (isValidBody(reviewData)) {
            return res.status(400).send({ status: false, message: "body cant be empty" })
        }
        //Destructuring
        let { reviewedBy, rating, review } = reviewData;

        //checking reviewdBy validation
        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "Reviewer's name should be string and cant empty" });
            }
        }
        //checking rating validation
        if (!rating || typeof (rating) != "number") {
            return res.status(400).send({ status: false, message: 'please provide rating in number' })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: 'Rating should be between 1 and 5 inclusively.' })
        }

        //checking review validation

        if (!isValid(review)) {
            return res.status(400).send({ status: false, message: 'Review should be present.' })
        }
        //checking bookId validation
        let bookId = req.params.bookId;

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid book id." })
        }
        let bookData = await bookModel.findOne({ _id: bookId });
        if (!bookData) {
            return res.status(400).send({ status: false, message: 'Could not find the book with the given bookId ' });
        }
        if (bookData.isDeleted == true) {
            return res.status(404).send({ status: false, message: 'This book has been deleted.' });
        }

        //creating review and making response Data
        reviewData.bookId = bookId
        reviewData.reviewedAt = new Date()


        let addReviewData = await reviewModel.create(reviewData);
        let countReviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).count();
        let updatedBookData = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { reviews: countReviews } }, { new: true, upsert: true });

        let responseData = {
            BookId: updatedBookData._id,
            title: updatedBookData.title,
            excerpt: updatedBookData.excerpt,
            userId: updatedBookData.userId,
            ISBN: updatedBookData.ISBN,
            category: updatedBookData.category,
            subcategory: updatedBookData.subcategory,
            reviews: updatedBookData.reviews,
            isDeleted: updatedBookData.isDeleted,
            reviewsData: addReviewData
        }

        return res.status(201).send({ status: true, message: "Success", data: responseData });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
//---------------------------------------------------update review-----------------------------------------------------------
const updateReview = async function (req, res) {
    try {

        let requestBody = req.body

        if (isValidBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details' })
        }
        //Destructuring
        const { reviewedBy, rating, review } = req.body

        //checking reviewedBy validation
        if (reviewedBy) {
            if (typeof (reviewedBy) != "string" || reviewedBy.trim().length === 0) {
                return res.status(400).send({ status: false, message: "Reviewer's name should be string and cant empty" });
            }
        }
        //checking rating validation
        if (rating) {
            if (!rating || typeof (rating) != "number") {
                return res.status(400).send({ status: false, message: 'please provide rating in number' })
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).send({ status: false, message: 'Rating should be between 1 and 5 inclusively.' })
            }
        }

        //checking review validation
        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: 'Review should be in string.' })
            }
        }
        //updating review and making response Data
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is not a valid book id" })

        }

        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "reviewId is not a valid review id" })

        }

        let checkBookDoc = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0, })

        if (!checkBookDoc) {
            return res.status(404).send({ status: false, message: 'book does not exist in book model' })
        }

        let checkReviewDoc = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })

        if (!checkReviewDoc) {
            return res.status(404).send({ status: false, message: 'review with this bookid does not exist' })
        }


        let updatedReviewData = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: { review: review, rating: rating, reviewedBy: reviewedBy } }, { new: true }).select({ __v: 0 })

        let returnData = {
            BookId: checkBookDoc._id,
            title: checkBookDoc.title,
            excerpt: checkBookDoc.excerpt,
            userId: checkBookDoc.userId,
            ISBN: checkBookDoc.ISBN,
            category: checkBookDoc.category,
            subcategory: checkBookDoc.subcategory,
            reviews: checkBookDoc.reviews,
            isDeleted: checkBookDoc.isDeleted,
            updatedReviewData: updatedReviewData, updatedReviewData: updatedReviewData
        }

        return res.status(200).send({ status: true, message: 'Book list', data: returnData });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//------------------------------------------delete book review----------------------------------------------
const deleteBookReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!mongoose.isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "Invalid book id." })

        if (!mongoose.isValidObjectId(reviewId))
            return res.status(400).send({ status: false, message: "Invalid review id." })

        let checkBook = await bookModel.findOne({ _id: bookId });
        if (!checkBook) {
            return res.status(404).send({ status: true, message: 'The book does not exists with the given bookId.' });
        }
        let checkReview = await reviewModel.findOne({ _id: reviewId });
        if (!checkReview) {
            return res.status(404).send({ status: false, message: 'The review does not exist with the given reviewId.' });
        }
        if (checkBook.isDeleted == true || checkReview.isDeleted == true) {
            return res.status(404).send({ status: false, message: "book or review is deleted" })
        }


        let deletedReviewData = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true } }, { new: true, upsert: true })
        let countReviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).count();
        let updatedBookData = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { reviews: countReviews } }, { new: true, upsert: true });
        let respond = {
            BookId: updatedBookData._id,
            title: updatedBookData.title,
            excerpt: updatedBookData.excerpt,
            userId: updatedBookData.userId,
            ISBN: updatedBookData.ISBN,
            category: updatedBookData.category,
            subcategory: updatedBookData.subcategory,
            reviews: updatedBookData.reviews,
            isDeleted: updatedBookData.isDeleted,
            deletedReviewData: deletedReviewData

        }
        return res.status(200).send({ status: true, message: 'Success', Data: respond })
    }

    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.deleteBookReview = deleteBookReview
module.exports.BookReview = createBookReview
module.exports.updateReview = updateReview
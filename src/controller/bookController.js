const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const reviewModel = require("../model/reviewModel")
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

const validReleaseDate = new RegExp(/^(18|19|20)[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
//--------------------------------------------create Book--------------------------------------//
const createBook = async function (req, res) {
    try {
        let bookData = req.body
        if (isValidBody(bookData)) {
            return res.status(400).send({ status: false, message: "body cant be empty" })
        }
        // Destructuring
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookData
        //checking title validation
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title is not valid" })
        }
        const doc = await bookModel.findOne({ title: bookData.title })
        if (doc) {
            return res.status(400).send({ status: false, message: "title should be unique" })
        }
        // checking excerpt validation
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt is not valid" })
        }
        // checking userID validation
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "userID is required" })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userID is not valid" })
        }

        const doc2 = await userModel.findOne({ _id: bookData.userId })
        if (!doc2) {
            return res.status(400).send({ status: false, message: "user is not registered" })
        }
        //checking isbn validation
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is required" })
        }
        if (ISBN.trim().length !== 13) {
            return res.status(400).send({ status: false, message: "ISBN must contain only numerics and should have 13 digits" })
        }
        const doc1 = await bookModel.findOne({ ISBN: bookData.ISBN })
        if (doc1) {
            return res.status(400).send({ status: false, message: "ISBN should be unique" })
        }
        //checking category validation

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "category is mandatory" })
        }

        //checking subcategory validation
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "subcategory is mandatory" })
        }
        //checking reviews validation

        if (reviews && typeof (reviews) != "number") {
            return res.status(400).send({ status: false, message: "reviews should be in number" })
        }

        //checking releaseAt validation


        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "releaseAt is mandatory" })

        }

        if (!validReleaseDate.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "Released date is not valid it should be YYYY-MM-DD" })
        }

        let data = await bookModel.create(bookData)
        return res.status(201).send({ status: true, message: 'Success', data: data })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }


}

//-------------------------------------------------get Book By Query------------------------------------//

const getBooksByQuery = async function (req, res) {
    try {

        let data = req.query;
        data.isDeleted = false;

        let { userId, category, subcategory } = data

        if (userId) {
            if (!userId) {
                return res.status(400).send({ status: false, message: "please provide userID" })
            }
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "You entered a invalid UserId" })
            }
            let check = await userModel.findById(userId)
            if (!check) {
                return res.status(404).send({ status: false, message: "No such userId exists" });
            }
            data.userId = userId
        }


        if (category) {
            if (!category) {
                return res.status(400).send({ status: false, message: "please provide category" })
            }
            data.category = category
        }
        if (subcategory) {
            if (!subcategory) {
                return res.status(400).send({ status: false, message: "please provide subcategory" })
            }
            data.subcategory = subcategory
        }


        let savedData = await bookModel.find(data).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        let respondData = savedData.sort((a, b) => a.title.localeCompare(b.title))
        if (savedData.length == 0) {
            return res.status(404).send({ status: false, message: "no document found" })
        }
        else {
            return res.status(200).send({ status: true, data: respondData });
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
//-------------------------------------------get Book By BookId-----------------------//

const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "You entered a invalid BookId" });
        }

        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ _v: 0 });

        if (!bookData) {
            return res.status(404).send({ status: false, message: "No book found" });
        }

        let findReview = await reviewModel.find({ bookId: bookId, isDeleted: false });


        let respondData = {
            _id: bookData._id,
            title: bookData.title,
            excerpt: bookData.excerpt,
            userId: bookData.userId,
            category: bookData.category,
            subcategory: bookData.subcategory,
            isDeleted: bookData.isDeleted,
            reviews: bookData.reviews,
            releasedAt: bookData.releasedAt,
            createdAt: bookData.createdAt,
            updatedAt: bookData.updatedAt,
            reviewsData: findReview
        }

        return res
            .status(200)
            .send({ status: true, message: "Book List", data: respondData });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

//-------------------------------------------update book --------------------------//
const updateBooks = async function (req, res) {

    try {
        const bookId = req.params.bookId

        const booksUpdates = req.body
        if (isValidBody(booksUpdates)) {
            return res.status(400).send({ status: false, message: "body cant be empty" })
        }

        const { title, excerpt, releasedAt, ISBN } = booksUpdates
        //checking title validation
        if (title) {
            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: "title is not valid" })
            }
            const doc = await bookModel.findOne({ title: title })
            if (doc) {
                return res.status(400).send({ status: false, message: "title should be unique" })
            }
        }
        // checking excerpt validation
        if (excerpt) {
            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, message: "excerpt is not valid" })
            }
        }
        //checking releaseAt validation
        if (releasedAt) {
            if (!isValid(releasedAt)) {
                return res.status(400).send({ status: false, message: "releaseAt is required and should not unvalid" })
            }

            if (!validReleaseDate.test(releasedAt)) {
                return res.status(400).send({ status: false, message: "Released date is not valid it should be YYYY-MM-DD" })
            }
        }

        //checking isbn validation
        if (ISBN) {
            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, message: "ISBN is not valid" })
            }
            if (ISBN.trim().length !== 13 || !Number(ISBN)) {
                return res.status(400).send({ status: false, message: "ISBN must contain only numerics and should have 13 digits" })
            }
            const doc1 = await bookModel.findOne({ ISBN: ISBN })
            if (doc1) {
                return res.status(400).send({ status: false, message: "ISBN should be unique" })
            }
        }
        // updating
        let books = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } }, { new: true });

        return res.status(200).send({ status: true, message: "updated successfully", data: books });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};
//----------------------------------------------delete book-----------------------------------//
const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ Status: false, message: "Please enter valid bookId" });
        }

        let data = await bookModel.findById(bookId);
        if (!data) {
            return res.status(404).send({ status: false, message: "id does not exist" });
        }
        if (data.isDeleted == true) {
            return res.status(404).send({ status: false, message: "book is already deleted" })
        }


        await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: Date.now() }, { new: true, upsert: true });
        return res.status(200).send({ status: true, message: "data deleted " });

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
};

module.exports = { createBook, getBooksByQuery, getBookById, updateBooks, deleteBook }
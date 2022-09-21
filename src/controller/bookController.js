const bookModel = require("../model/bookModel")
const userModel=require("../model/userModel")
//-------------------------------------------common isvalid Function--------------------------//
const isValid = function(value){
    if(typeof value ==="undefined" || value === null) return false
    if(typeof value ==="string" && value.trim().length ===0)return false
    return true
}
const isValidBody = function(value){
    if(Object.keys(value).length == 0)return true
    return false
}
//--------------------------------------------create Book--------------------------------------//
const createBook=async function(req,res){
  try{
    let bookData = req.body
    if(isValidBody(bookData)){
        return res.status(400).send({status:false, message: "body cant be empty"})
    }
  // Destructuring
    const {title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookData
  //checking title validation
    if(!isValid(title)){
         return res.status(400).send({status:false, message: "title is not valid"})
    }
    const doc = await bookModel.findOne({title: bookData.title})
    if(doc){
         return res.status(400).send({status:false, message: "title should be unique"})
    }
// checking excerpt validation
    if(!isValid(excerpt)){
       return  res.status(400).send({status:false, message: "excerpt is not valid"})
    }
// checking userID validation
    if(!isValid(userId)){
        return res.status(400).send({status:false, message: "userID is required"})
    }
    const doc2 = await userModel.findOne({_Id: bookData.userId})
    if(!doc2){
       return  res.status(400).send({status:false, message: "user is not registered"})
    }
    //checking isbn validation
    if(!isValid(ISBN)){
        return res.status(400).send({status:false, message: "ISBN is not valid"})
    }
    const doc1 = await bookModel.findOne({ISBN: bookData.ISBN})
    if(doc1){
       return  res.status(400).send({status:false, message: "ISBN should be unique"})
    }
    //checking category validation

    if(!isValid(category)){
       return  res.status(400).send({status:false, message: "category is not valid"})
    }

    //checking subcategory validation
    if(!isValid(subcategory)){
       return res.status(400).send({status:false, message: "subcategory is not valid"})
    }
    //checking reviews validation
    
    if (bookData.reviews && typeof (bookData.reviews) != "number") {
        return res.status(400).send({ status: false, message: "reviews should be in number" })
    }

    //checking releaseAt validation
    if(!isValid(releasedAt)){
       return  res.status(400).send({status:false, message: "releaseAt is required and should not unvalid"})
    }
    

    let data = await bookModel.create(bookData) 
    return res.status(201).send({status: true, message: 'Success',data: data})
}
catch (error) {
    return res.status(500).send({ status: false, message: error.message })
}

    
}

const getBooks = async function (req, res) {
    try {

        let obj = { isDeleted: false }
        let { userId, category, subcategory } = req.query

        if (userId) { obj.userId = userId }
        if (category) { obj.category = category }
        if (subcategory) { obj.subcategory = { $in: [subcategory] } }


        let savedData = await bookModel.findOne(obj)
        if (savedData.length == 0) {
            return res.status(404).send({ status: false, msg: "no document found" })
        }
        let specificData = await bookModel.find({ _id: savedData._id, isDeleted: false }).select({
            _id: 1, title: 1, excerpt: 1,userId: 1, category: 1, releasedAt: 1, reviews: 1}).sort((a,b)=>a-b)
        return res.status(200).send({ status: true, message: 'Books list', data: specificData })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports={createBook,getBooks}
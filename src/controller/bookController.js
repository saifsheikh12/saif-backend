const bookModel = require("../model/bookModel")
const userModel=require("../model/userModel")
const moment = require('moment');
const today = moment();
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
    if (!today.format('YYYY-MM-DD')){
        console.log(today)
        return res.status(400).send({ status: false, message: "Released date is not valid it should be YYYY-MM-DD" })}

    

    let data = await bookModel.create(bookData) 
    return res.status(201).send({status: true, message: 'Success',data: data})
}
catch (error) {
    return res.status(500).send({ status: false, message: error.message })
}

    
}

const getBooks = async function (req, res) {
    try {

    //  let data= req.query;
      // data.isDeleted= false;

//         let { userId, category, subcategory } = data

//         if (userId) { data.userId = userId }
//          if (category) { data.category = category }
//          if (subcategory) { data.subcategory = { $in: [subcategory] } }


//         let savedData = await bookModel.find(data)
//    if (savedData.length == 0) {
//             return res.status(404).send({ status: false, msg: "no document found" })}
//     return res.status(200).send({ status: true, data:savedData });
               
            

    //      let specificData = await bookModel.find({ _id: savedData._id, isDeleted: false }).select({
    //         _id: 1, title: 1, excerpt: 1,userId: 1, category: 1, releasedAt: 1, reviews: 1})/*.sort((a,b)=>a-b)*/
    //      return res.status(200).send({ status: true, message: 'Books list', data: specificData })
    

        if (Object.keys(req.query).length < 1) {
            const findBooks = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
            res.status(200).send({ status: true, message: "Success", data: findBooks })
        } else {
            const { userId, category, subcategory } = req.query
    
            let filterBooks = await bookModel.find({
                $and: [
                    {
                        $and: [{ isDeleted: false }],
                        $or: [{
                            $or: [
                                { "userId": { $in: userId } },
                                { "category": { $in: category } },
                                { "subcategory": { $in: [subcategory] } }
                            ]
                        }]
                    },
                ]
            }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
            res.status(200).send({ status: true, message: "Success", data: filterBooks })
    
        }
    
    
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
//-------------------------------------------upadtion api --------------------------//
const updateBooks= async function(req,res){

try{
    const bookId =req.params.bookId
    const booksUpdates= req.body
    const{title,excerpt,releaseAt,ISBN}=booksUpdates
    let books = await bookModel.findOneAndUpdate({_id:bookId ,isDeleted:false},
        {$set:{title:title,excerpt:excerpt,releaseAt:releaseAt,ISBN:ISBN}}
        ,{new:true}
        );
        if (!bookId) {
            return res.status(404).send({ status: false, msg: "bookId  not found" });
          }
          return res.status(200).send({ status: true, msg :"updated successfully",data:books });
}
catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

module.exports={createBook,getBooks,updateBooks}
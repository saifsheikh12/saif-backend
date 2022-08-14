const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema( {
    booksName: String,
    authorName: String,
    category:String,
    years:Number
  
}, { timestamps: true });

module.exports = mongoose.model('User', bookSchema) //users



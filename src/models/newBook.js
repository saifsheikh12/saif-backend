const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema({
    name: String,
    author: {
        type: ObjectId,
        ref: "ItsAuthor"
    },
    price: Number,
    ratings: Number,
    publisher: {
        type: ObjectId,
        ref: "ItsPublisher"
    }, 
    isHArdCover:Boolean


}, { timestamps: true });


module.exports = mongoose.model('ItsBook', bookSchema)

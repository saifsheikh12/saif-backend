const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const studentSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    teacherId: {
        type: ObjectId,
        required: true,
        ref: 'teacher'
    }

}, { timestamps: true })



module.exports = mongoose.model('student', studentSchema)
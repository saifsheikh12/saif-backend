const studentModel = require('../Models/studentModel')
const teacherModel = require('../Models/teacherModel')
const mongoose = require('mongoose')
const nameRegex = /^[a-zA-Z ]{2,30}$/


const createStudents = async function (req, res) {

    try {
        let data = req.body
        let { firstName, lastName, subject, marks, teacherId } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'please provide some data' })
        }
        if (!firstName) return res.status(400).send({ status: false, message: "Please Provide firstName" })
        if (!nameRegex.test(firstName)) return res.status(400).send({ status: false, message: "Please Provide Valid firstName" })

        if (!lastName) return res.status(400).send({ status: false, message: "Please Provide lastName" })
        if (!nameRegex.test(lastName)) return res.status(400).send({ status: false, message: "Please Provide Valid lastName" })

        if (!subject) return res.status(400).send({ status: false, message: "Please Provide subject" })

        if (!marks) return res.status(400).send({ status: false, message: "Please Provide marks" })
        if(typeof marks != 'number') return res.status(400).send({status : false, message : 'please provide valid marks'})

        if (!teacherId) return res.status(400).send({ status: false, message: 'please provide teacherId' })

        if (!mongoose.isValidObjectId(teacherId)) {
            return res.status(400).send({ status: false, message: "invalid teacherId format" });
        }

        let teacher = await teacherModel.findById(teacherId)
        if (!teacher) {
            return res.status(404).send({ status: false, message: "teacher doesn't exist" })
        }
        const findStudent = await studentModel.findOne({ firstName: firstName, lastName: lastName, subject: subject, teacherId: teacherId })
        if (findStudent) {
            const updateStudent = await studentModel.findOneAndUpdate({ firstName: firstName, lastName: lastName, subject: subject, teacherId: teacherId },
                { $inc: { marks: +marks } }, { new: true })
            return res.status(200).send({ status: true, message: "marks updated successfully ", data: updateStudent })
        }

        const studentData = await studentModel.create(data)
        res.status(201).send({ status: true, message: 'student created successfully', data: studentData })

    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}




const getStudent = async function (req, res) {

    try {
        let studentId = req.params.studentId

        if (!mongoose.isValidObjectId(studentId)) return res.status(400).send({ satus: false, message: "studentId is not valid" })

        let allstudent = await studentModel.findById(studentId)
        if (!allstudent) return res.status(404).send({ satus: false, message: "studentId does not Exist" })

        let result = await studentModel.findOne({ _id: studentId, isDeleted: false })
        if (!result) return res.status(404).send({ status: false, message: "student Not Found Or Deleted" })

        return res.status(200).send({ status: true, message: "data fetched successfully", data: allstudent })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}




const updateStudent = async function (req, res) {

    try {
        const data = req.body
        let studentId = req.params.studentId

        const { firstName, lastName, subject, marks } = data
        let obj = {}

        if (firstName) obj.firstName = firstName
        if (lastName) obj.lastName = lastName
        if (subject) obj.subject = subject
        if (marks) obj.marks = marks

        if (!mongoose.isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "please provide valid studentId" })
        if (Object.keys(data).length == 0) return res.status(400).send({ satus: false, message: "for updation data is required" })

        let student = await studentModel.findById(studentId)
        if (!student) return res.status(404).send({ status: false, message: "student does not found" })

        if (!nameRegex.test(firstName)) return res.status(400).send({ status: false, message: "Please Provide Valid firstName" })

        if (!nameRegex.test(lastName)) return res.status(400).send({ status: false, message: "Please Provide Valid lastName" })

        const updateStudent = await studentModel.findOneAndUpdate({ _id: studentId }, { $set: obj }, { new: true })

        return res.status(200).send({ status: true, message: "Student update is successful", data: updateStudent })

    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}




const deleteStudent = async function (req, res) {

    try {
        let studentId = req.params.studentId

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "please provide valid studentId" })
        }

        const student = await studentModel.findOne({ _id: studentId, isDeleted: false })
        if (!student) {
            return res.status(404).send({ status: false, message: "student does not found" })
        }

        await studentModel.updateOne({ _id: studentId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } })
        return res.status(200).send({ status: true, message: "student deleted successfully" })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}


module.exports = { createStudents, getStudent, updateStudent, deleteStudent }
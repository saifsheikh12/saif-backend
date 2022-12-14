const studentModel = require('../Models/studentModel')
const teacherModel = require('../Models/teacherModel')
const mongoose = require('mongoose')
const nameRegex = /^[a-zA-Z ]{2,30}$/


const createStudents = async function (req, res) {

    try {
        let data = req.body
        let { name, subject, marks, teacherId } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'please provide some data' })
        }
        if (!name) return res.status(400).send({ status: false, message: "Please Provide name" })
        if (!nameRegex.test(name)) return res.status(400).send({ status: false, message: "Please Provide Valid name" })

        if (!subject) return res.status(400).send({ status: false, message: "Please Provide subject" })

        if (!marks) return res.status(400).send({ status: false, message: "Please Provide marks" })
        if (typeof marks != 'number') return res.status(400).send({ status: false, message: 'please provide valid marks' })

        if (!teacherId) return res.status(400).send({ status: false, message: 'please provide teacherId' })

        if (!mongoose.isValidObjectId(teacherId)) {
            return res.status(400).send({ status: false, message: "invalid teacherId format" });
        }

        let teacher = await teacherModel.findById(teacherId)
        if (!teacher) {
            return res.status(404).send({ status: false, message: "teacher doesn't exist" })
        }
        const findStudent = await studentModel.findOne({ name: name, subject: subject, teacherId: teacherId })
        if (findStudent) {
            const updateStudent = await studentModel.findOneAndUpdate({ name: name, subject: subject, teacherId: teacherId },
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
        let data = req.query
        let teacherId = req.params.teacherId
        let { name, subject } = data
        let queryFilter = { teacherId: teacherId, isDeleted: false }

        if (name) queryFilter.name = name
        if (subject) queryFilter.subject = subject

        let findStudent = await studentModel.find(queryFilter)
        if (findStudent.length === 0) return res.status(400).send({ status: false, message: 'no student found' })

        return res.status(200).send({ status: true, message: "students fetched successfully", data: findStudent })

    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })

    }
}




const updateStudent = async function (req, res) {

    try {
        const data = req.body
        let teacherId = req.params.teacherId
        let studentId = req.params.studentId

        const { name, subject, marks } = data
        let obj = {}

        if (name) obj.name = name
        if (subject) obj.subject = subject
        if (marks) obj.marks = marks

        if (!(name || subject || marks)) {
            return res.status(400).send({ satus: false, message: "Please Provide Only name,subject,marks" })
        }

        if (!mongoose.isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "please provide valid studentId" })
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "for updation data is required" })

        let student = await studentModel.findOne({ _id: studentId, teacherId: teacherId })
        if (!student) return res.status(404).send({ status: false, message: "student does not found" })

        if (!nameRegex.test(name)) return res.status(400).send({ status: false, message: "Please Provide Valid name" })

        const updateStudent = await studentModel.findOneAndUpdate({ _id: studentId}, { $set: obj }, { new: true })

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
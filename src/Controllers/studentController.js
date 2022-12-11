const studentModel = require('../Models/studentModel')
const teacherModel = require('../Models/teacherModel')
const nameRegex = require('./teacherController')
const mongoose = require('mongoose')


const createStudents = async function(req, res){

    try{
        let data = req.body
        let {firstName, lastName, subject, marks, teacherId} = data

        if(Object.keys(data).length===0){
            return res.status(400).send({status : false, message : 'please provide some data'})
        }
        if (!firstName) return res.status(400).send({ status: false, message: "Please Provide firstName"})
        if (!nameRegex.test(firstName)) return res.status(400).send({ status: false, message: "Please Provide Valid firstName"})

        if (!lastName) return res.status(400).send({ status: false, message: "Please Provide lastName"})
        if (!nameRegex.test(lastName)) return res.status(400).send({ status: false, message: "Please Provide Valid lastName"})

        if(!subject) return res.status(400).send({ status: false, message: "Please Provide subject"})

        if(!marks) return res.status(400).send({ status: false, message: "Please Provide marks"})
        if(marks !== 'number') return res.status(400).send({status : false, message : 'please provide valid marks'})

        if(!teacherId) return res.status(400).send({ status : false, message : 'please provide teacherId'})

        if (!mongoose.isValidObjectId(teacherId)) {
            return res.status(400).send({ status: false, msg: "invalid teacherId format"});
        }

        let teacher = await teacherModel.findById(teacherId)
        if (!teacher) {
            return res.status(404).send({ status: false, msg: "teacher doesn't exist"})
        }

        const studentData = await studentModel.create(data)
        res.status(201).send({ status: true, message: 'student created successfully', data: studentData })

    }
    catch(error){
        res.status(500).send({status : false, Error : error.message})
    }
}




const getStudent = async function(req, res){

    try{
        
    }
    catch(error){
        res.status(500).send({status : false, Error : error.message})
    }
}



module.exports = {createStudents, getStudent}
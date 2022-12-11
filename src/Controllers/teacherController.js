const teacherModel = require('../Models/teacherModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const nameRegex = /^[a-zA-Z ]{2,30}$/
const emailRegex = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/
const mobileRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/


const createTeachers = async function (req, res) {

    try {
        let data = req.body
        let { firstName, lastName, phone, email, password } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'please provide some details'})
        }
        if (!firstName) return res.status(400).send({ status: false, message: "Please Provide firstName"})
        if (!nameRegex.test(firstName)) return res.status(400).send({ status: false, message: "Please Provide Valid firstName"})

        if (!lastName) return res.status(400).send({ status: false, message: "Please Provide lastName"})
        if (!nameRegex.test(lastName)) return res.status(400).send({ status: false, message: "Please Provide Valid lastName"})

        if (!phone) return res.status(400).send({ status: false, message: "Please Provide Mobile Number"})
        if (!mobileRegex.test(phone)) return res.status(400).send({ status: false, message: "Please Provide Valid Mobile Number"})

        let duplicatePhone = await teacherModel.findOne({ phone })
        if (duplicatePhone) return res.status(400).send({ status: false, message: "phone is already registered!"})

        if (!email) return res.status(400).send({ status: false, message: "Please Provide Email"})
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "Please Provide Valid Email"})

        let duplicateEmail = await teacherModel.findOne({ email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: "email is already registered!"})

        if (!password) return res.status(400).send({ status: false, message: 'please provide password'})
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: 'please provide valid password'})

        const newpass = await bcrypt.hash(password, 10)
        data["password"] = newpass

        const teacherData = await teacherModel.create(data)
        res.status(201).send({ status: true, message: 'teacher created successfully', data: teacherData })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}




const teacherLogin = async function (req, res) {
    
    try {
        let data = req.body
        const { email, password } = data

        if (Object.keys(data).length === 0) {
            res.status(400).send({ status: false, message: 'please provide some data'})
        }

        if (!email) return res.status(400).send({ status: false, message: 'Email is required'})

        if (!password) return res.status(400).send({ status: false, message: 'password is required'})

        let teacher = await teacherModel.findOne({ email })
        if (!teacher) return res.status(400).send({ status: false, message: "email or password is incorrect"})

        let hashedPassword = await bcrypt.compare(password, teacher.password)
        if (!hashedPassword) return res.status(400).send({ status: false, message: "email or password is incorrect"})

        let token = jwt.sign({
            teacherId: teacher._id,

        }, 'my assignment for TAILWEBS',
            { expiresIn: "24hr" })

        res.status(201).send({ status: true, message: 'token created successfully', data: token })

    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}



module.exports = { createTeachers, teacherLogin }
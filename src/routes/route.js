const express = require('express')
const router = express.Router()
const { createTeachers, teacherLogin } = require('../Controllers/teacherController')
const { createStudents, getStudent, updateStudent, deleteStudent } = require('../Controllers/studentController')
const { authentication, authorisation } = require('../MiddleWares/auth')


router.get('/test-me', function (req, res) {
    res.send('My Fisrt API')
})


router.post('/register', createTeachers)
router.post('/login', teacherLogin)


router.post('/students', authentication, createStudents)
router.get('/students/:teacherId', authentication, authorisation, getStudent)
router.put('/students/:teacherId/:studentId', authentication, authorisation, updateStudent)
router.delete('/students/:teacherId/:studentId', authentication, authorisation, deleteStudent)


module.exports = router
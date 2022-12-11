const express = require('express')
const router = express.Router()
const {createTeachers, teacherLogin} = require('../Controllers/teacherController')
const {createStudents, getStudent, updateStudent, deleteStudent} = require('../Controllers/studentController')


router.get('/test-me', function(req,res){
    res.send('My Fisrt API')
})


router.post('/register', createTeachers)
router.post('/login', teacherLogin)


router.post('/students', createStudents)
router.get('/students/:studentId', getStudent)
router.put('/students/:studentId', updateStudent)
router.delete('/students/:studentId', deleteStudent)


module.exports = router
const express = require('express')
const router = express.Router()
const {createTeachers, teacherLogin} = require('../Controllers/teacherController')
const {createStudents} = require('../Controllers/studentController')


router.get('/test-me', function(req,res){
    res.send('My Fisrt API')
})


router.post('/register', createTeachers)
router.post('/login', teacherLogin)


router.post('/students', createStudents)
router.get('/students', getStudent)


module.exports = router
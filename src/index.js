const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')
const app = express()

app.use(express.json())

// mongoose.connect('',
// {useNewUrlParser: true})

// .then(() => console.log('MongoDB is connected'))
// .catch(err => console.log(err))

app.use('/', route)

route.all('/*', function(req, res){
    res.status(400).send({status: false, message: 'Url Wrong'})
})

app.listen( 3000, function(){
    console.log('Express app running on PORT ' + 3000)
})
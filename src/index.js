// // import express from "express"
// const express=require("express")
// // import mongoose from "mongoose"
// const mongoose=require("mongoose")
// ///import mongoose from "mongoose"
// // import route from "./routes/route"
// const route=require("./routes/route")

// const app=express()

// const PORT = 3000

// const URL="mongodb+srv://Madhurilenka:Madhuri1998@cluster0.zcysdvm.mongodb.net/Madhuri-Group33"

// app.use(express.json())

// mongoose.connect(URL, {
//     useNewUrlParser: true
// })
//     .then(() => console.log('MongoDB is connected'))
//     .catch(err => console.log(err.message))

// app.use('/', route)

// app.listen(PORT, () => console.log(`Express app is running on port ${PORT}`))


const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/route')

const app = express()

app.use(bodyParser.json())
mongoose.connect("mongodb+srv://Sumit:Shakya123@cluster0.of12ajb.mongodb.net/group33Database", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

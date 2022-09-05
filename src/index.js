const express = require("express");
const bodyParser = require('body-parser');
const { default: mongoose } = require("mongoose");
const route = require("./routes/route")
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://vipul-functionup:dHQN7pHckdlNc5gX@cluster0.hh8ax.mongodb.net/group39Database", {
    useNewUrlParser: true
}).then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
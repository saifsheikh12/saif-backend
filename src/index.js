const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route)

//sol1 find missing number 4

app.get("sol1",function (req ,res){
    let arr =[1,2,3,5,6,7]
    
    let total =0;
    for(var i in arr){
        total +=arr[i];
        
    }
    let lastdigit=arr.pop()
    let consecutivesum = lastdigit * (lastdigit+1)/2
    let missingNumber = consecutivesum-total

    res.send ({data:missingNumber} );
})



//sol2 36 missing number


app.get("sol2",function (req ,res){
    let arr =[33,34,35,37,38]
    let len=arr.length
    
    let total =0;
    for(var i in arr){
        total =total + arr[i];
        
    }
    let firstDigit=arr[0]
    let lastdigit=arr.pop()
    let consecutivesum = (len + 1)*(firstDigit+lastdigit) /2
    let missingNumber = consecutivesum-total

    res.send ({data:missingNumber} );
})




app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});






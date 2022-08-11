const { query } = require('express');
const express = require('express');
const abc = require('../introduction/intro')
const router = express.Router();

router.get('/test-me', function (req, res) {
    console.log('My batch is', abc.name)
    abc.printName()
    res.send('My second ever api!')
});


router.get('/test-you', function (req, res) {
    res.send('This is the second routes implementation')
})


router.get('/test-you-1', function (req, res) {
           let arr =[ 12,"saifsheikh"]
           let ele =req.body.element
           arr.push(ele)

           res.send({ msg:arr, status :true})
})




//solution 1

router.get('/movie', function (req, res) {
    let movie = ['Rang de basanti', 'The shining', 'Lord of the rings', 'Batman begins']
    res.send(movie)
})


 //solution 2 movies

router.get('/movies/:indexNumber', function (req, res) {
    let movie = ['Rang de basanti', 'The shining', 'Lord of the rings', 'Batman begins']
    console.log(req.params.indexNumber)
    let i = req.params.indexNumber
    if (i < 0 || i >= movie.length) {
        return res.send('The index value is incorrect')
    }     
    let result = movie[i]
    res.send(result)
})

//solution 3 films

router.get('/film', function (req, res) {
    let arr = [
        {
            'id': 1,
            'name': 'Rang de basanti'
        },
        {
            'id': 2,
            'name': 'The shining'
        },
        {
            'id': 3,
            'name': 'Lord of the rings'
        },
        {
            'id': 4,
            'name': 'Batman begins'
        }
    ]
    res.send(arr)
})



//solution 4 filmid


router.get('/films/:filmId', function (req, res) {
    let filmName = [
        {
            'id': 1,
            'name': 'The Shining'
        },
        {
            'id': 2,
            'name': 'Incendies'
        },
        {
            'id': 3,
            'name': 'Rang de Basanti'
        },
        {
            'id': 4,
            'name': 'Finding Nemo'
        }
    ]
    let filmId = req.params.filmName

    for (i = 0; i < filmName.length; i++) {
        let film = filmName[i]
        if (film.id == filmId) {
            return res.send(film)
        }
    }
    res.send("The film id doesn't match any movie")
})


router.get('/give-me-students-data', function (req, res) {

})

//.......................players........................................................................................................
let players = [
    {
        "name": "manish",
        "dob": "1/1/1995",
        "gender": "male",
        "city": "jalandhar",
        "sports": [
            "swimming"
        ]
    },
    {
        "name": "gopal",
        "dob": "1/09/1995",
        "gender": "male",
        "city": "delhi",
        "sports": [
            "soccer"
        ]
    },
    {
        "name": "lokesh",
        "dob": "1/1/1990",
        "gender": "male",
        "city": "mumbai",
        "sports": [
            "soccer"
        ]
    },

 ]

//..........................................................................................................................................
 //solution 1 of 11Aug players 

 

router.post('/players', function (req, res) {
    
    let newPlayer = req.body
    let newPlayersName = newPlayer.name
    let isNameRepeated = false

    //let player = players.find(p => p.name == newPlayersName)

    for(let i = 0; i < players.length; i++) {
        if(players[i].name == newPlayersName) {
            isNameRepeated = true;
            break;
        }
    }

    //undefined is same as false/ a falsy value
    if (isNameRepeated) {
        //Player exists
        res.send("This player was already added!")
    } else {
        //New entry
        players.push(newPlayer)
        res.send(players)
    }
});

//..........................................................................................................................................

//solution 2 of 11August booking 

let booking = [
    // {
    //     bookingNumber: 1,
    //     bookingId: 12,
    //     sportId: "",
    //     centerId: "",
    //     type: "private",
    //     slot: "16286598000000",
    //     bookedOn: "31/08/2021",
    //     bookedFor: "01/09/2021",
    // },
];


router.post("/players/:playerName/bookings/:bookingId", function (req, res) {
    let playerExist = false
    for (let i = 0; i < players.length; i++) {
        if (players[i].name == req.params.playerName) {
            playerExist = true
        }
    }
    if (!playerExist) {
        return res.send("This player does not exist")
    }
    for (let i = 0; i < booking.length; i++) {
        if ((booking[i].bookingId == req.params.bookingId)) {
            return res.send("This booking id already existed in Data");
        }
    }
    req.body.playerName = req.params.playerName
    req.body.bookingId = req.params.bookingId

    booking.push(req.body);
    return res.send(booking);
});

//....................................................................................................................................
//second assignment odf voting 

let persons = [
    {
      name : "PK",
      age : 10,
      votingstatus : false
    },
    {
        name : "Sk",
        age : 20,
        votingstatus : false
    },
    {
        name : "AA",
        age : 70,
        votingstatus : false
    },
    {
        name : "SC",
        age : 5,
        votingstatus : false
    },
    {
        name : "HQ",
        age : 40,
        votingstatus : false
    }
]
router.post("/persons", function voting (req,res){

    let votingAge = req.query.votingAge

    let result = []
    for(let i=0 ; i<persons.length;i++){c
        let id = persons[i]
        if(id.age>votingAge){
            id.votingstatus=true 
            result.push(id)
        }
    }
return res.send({data :result , status: true})
})








module.exports = router;
// adding this comment for no r
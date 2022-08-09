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



router.get('/movie', function (req, res) {
    let movie = ['Rang de basanti', 'The shining', 'Lord of the rings', 'Batman begins']
    res.send(movie)
})



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
    let filmId = req.params.filmId

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
module.exports = router;
// adding this comment for no reason
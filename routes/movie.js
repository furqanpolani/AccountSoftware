
"use strict"

module.exports = function(express,app, models){

    var router = express.Router();
    var movie = require('../lib/movie')(models); 
    
    //get all //done
    router.get('/', function(req, res){
        movie.getAll().then(function(completeMovie){
            var result = {}
            result['userData'] = req.user
            result['completeMovie'] = completeMovie
            console.log('result object is : ', result)
            res.render("moviePage/movieList",{'result': result} );
        })
    });
    router.get('/addMovies', (req,res) =>{
        var result = {}
        result['userData'] = req.user;
        res.render("moviePage/addMovie", result)
    })

    return router;
}

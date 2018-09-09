"use strict"

module.exports = function(router, app, models){
    var movie = require('../lib/movie')(models); 
    
    //get all //done
    router.get('/movie', function(req, res){
        movie.getAll().then(result =>{
            res.status(result.code).json(result)
        })
    });


    //create //done
    router.post('/movie', function(req, res){
        movie.create(req.body).then(result =>{
            res.status(result.code).json(result)
        })
    });


    //update //done
    router.put('/movieUpdate/:id', function(req, res){
        var movieId = req.params.id;
        movie.updateById(req.body, movieId).then(result =>{
            res.status(result.code).json(result)
        });
    });
    

    //get by id //done
    router.get('/movie/:id', function(req, res){
        var movieId= req.params.id;
        movie.getById(movieId).then(result =>{
            res.status(result.code).json(result)
        })
    });
    

    //delete by id //done
    router.delete('/movie/:id',function(req, res){ 
        var movieId = req.params.id;
        movie.deleting(movieId).then(result =>{
            res.status(result.code).json(result)
        });
    });  
    
return router; 
}

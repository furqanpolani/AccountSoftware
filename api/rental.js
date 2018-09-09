"use strict"

module.exports = function(router, app, models){
    var rental = require('../lib/rental')(models); 
    
    //get all //done
    router.get('/rental', function(req, res){
        rental.getAll(req).then(result =>{
            res.status(result.code).json(result)
        
            
        })
    });


    //create //done
    router.post('/rental', function(req, res){
        rental.create(req).then(result =>{
            res.status(result.code).json(result)
        })
    });


    //update //done
    router.put('/rentalUpdate/:id', function(req, res){
        var rentalId = req.params.id;
        rental.updateById(req.body, rentalId).then(result =>{
            res.status(200).json(result)
        });
    });
    

    //get by id //done
    router.get('/rental/:id', function(req, res){
        var rentalId= req.params.id;
        rental.getById(rentalId).then(result =>{
            res.status(result.code).json(result)
        })
    });
    

    //delete by id //done
    router.delete('/rental/:id',function(req, res){ 
        var rentalId = req.params.id;
        rental.deleting(rentalId).then(result =>{
            res.status(result.code).json(result)
        });
    });  
    
return router; 
}

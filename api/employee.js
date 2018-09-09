"use strict"

module.exports = function(router, app, models){
    var employees = require('../lib/employee')(models); 
    
    //get all //done
    router.get('/employee', function(req, res){
        employees.getAll().then(result =>{
            res.status(result.code).json(result)
        })
    });


    //create //done
    router.post('/employee', function(req, res){
        employees.create(req.body).then(result =>{
            res.status(result.code).json(result)
        })
    });


    //update //done
    router.put('/employeeUpdate/:id', function(req, res){
        var employeeId = req.params.id;
        console.log('req.params. id is', employeeId)
        employees.updateById(req.body, employeeId).then(result =>{
            res.status(result.code).json(result)
        });
    });
    

    //get by id //done
    router.get('/employee/:id', function(req, res){
        var employeeId= req.params.id;
        employees.getById(employeeId).then(result =>{
            res.status(result.code).json(result)
        })
    });
    

    //delete by id //done
    router.delete('/employee/:id',function(req, res){ 
        var employeeId = req.params.id;
        employees.deleting(employeeId).then(result =>{
            res.status(result.code).json(result)
        });
    });  
    
return router; 
}

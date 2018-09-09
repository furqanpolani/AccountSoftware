"use strict"

module.exports = function(router, app, models){
    var customers = require('../lib/customer')(models); 
    
    //get all //done
    router.get('/customer', function(req, res){
        customers.getAll().then(result =>{
            res.status(result.code).json(result)
        })
    });
    
    //create //done
    router.post('/customer', function(req, res){
        customers.create(req.body).then(result =>{
            res.status(result.code).json(result)
        })
    });

    //update //done
    router.put('/customerUpdate/:id', function(req, res){
        // var customerId = req.params.id;
        req.body['customerId'] = req.params.id
        customers.updateById(req.body).then(result =>{
            console.log( 'and the result of status is ', result)
            res.status(result.code).json(result)
        });

    });
    

    //get by id //done
    router.get('/customer/:id', function(req, res){
        var customerId= req.params.id;
        console.log("hi my name is furqa")
        customers.getById(customerId).then(result =>{
            res.status(result.code).json(result)
        })
    });
    
    //get by name 
    router.get('/customer/test/:id', function(req, res){ 
        var customerName=req.params.id;
        console.log('here iss the name : ', customerName);
        customers.getByName(customerName).then(result =>{
            console.log('And the result is : ', result)
            res.status(result.code).json(result)
        })
    });
    

    //delete by id //done
    router.delete('/customer/:id',function(req, res){ 
        var customerId = req.params.id;
        customers.deleting(customerId).then(result =>{
            res.status(result.code).json(result)
        });
    });
    

    //customer with rental attributes //done
    router.get('/customer/rental/:id', function (req, res){
        var customerId = req.params.id;
        customers.customerWithRent(customerId).then(result =>{
            res.status(result.code).json(result);
        })
    });  
    
return router; 
}

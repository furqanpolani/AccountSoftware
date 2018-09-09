"use strict"

module.exports = function(router, app, models){
    var purchases = require('../lib/purchase')(models); 
    
    //get all //done
    router.get('/purchase', function(req, res){
        purchases.getAll().then(result =>{
            res.status(result.code).json(result)
        }) 
    });


    //create //done
    router.post('/purchase', function(req, res){
        console.log('created purchase is ', req.body)
        purchases.create(req.body).then(result =>{
            res.status(result.code).json(result)
        })
    });


    //update //done
    router.put('/purchaseUpdate/:id', function(req, res){
        var purchasesId = req.params.id;
        console.log('purchase id in api is :', purchasesId)
        purchases.updateById(req.body, purchasesId).then(result =>{
            res.status(200).json(result)
        });
    });
    

    //get by id //done
    router.get('/purchase/:id', function(req, res){
        var purchasesId= req.params.id;
        purchases.getById(purchasesId).then(result =>{
            res.status(result.code).json(result)
        })
    });
    

    //delete by id //done
    router.delete('/purchase/:id',function(req, res){ 
        var purchasesId = req.params.id;
        purchases.deleting(purchasesId).then(result =>{
            res.status(result.code).json(result)
        });
    });  
    
return router; 
}


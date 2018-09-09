"use strict"

module.exports = function(express,app, models){

    var router = express.Router();
    var customer = require('../lib/customer')(models); 

    //get all //done
    router.get('/', function(req, res){
        var result = {}
        var data 
        customer.getAll(req).then(function(completeData){
            data = completeData
            console.log(req)
            customer.getAllForLookUp().then((lookupData) =>{
                result['completeData'] = data
                result ['lookupData'] = lookupData 
                result['userData'] = req.user
                result['option'] = req.query
                // console.log('result is :', result.lookupData)
                res.render("customerPage/customerList", {'result':result});

            })    
        })
    });
    router.get('/addCustomers', function(req, res){
        var result = {};
        result['userData'] = req.user
        res.render("customerPage/addCustomer", result)
    })

    

    return router;
}

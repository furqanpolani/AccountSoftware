"use strict"

module.exports = function(express,app, models){

    var router = express.Router();
    var purchase = require('../lib/purchase')(models); 
    
    //get all //done

    router.get('/', function(req, res){
        var result = {}
        var data 
        purchase.getAll().then(function(completeData){
            data = completeData
            purchase.getAllForLookUp().then((lookupData) =>{
                result['completeData'] = data
                result ['lookupData'] = lookupData 
                result['userData'] = req.user
                result['option'] = req.query
                console.log('result is :', result)
                res.render("purchasePage/purchaseList", {'result':result});

            })    
        })
    });

    return router;
}

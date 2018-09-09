
"use strict"

module.exports = function(express,app, models){

    var router = express.Router();
    var rental = require('../lib/rental')(models);
    var customer = require('../lib/customer')(models);
    var movie = require('../lib/movie')(models);
    
    router.get('/', function(req, res){
        console.log(req.body)
        var result = {}
        var data 
        rental.getAll(req).then(function(completeData){
            data = completeData
            rental.getAllForLookUp().then((lookupData) =>{
                result['completeData'] = data
                result ['lookupData'] = lookupData 
                result['userData'] = req.USER
                result['option'] = req.query
                console.log('result is :', result)
                res.render("rentalPage/rentalList", {'result':result});

            })    
        })
    });

    router.get('/addRentals', function(req, res) { 
        console.log("and we print here", req.user)
        rental.getAllForLookUp().then(function(result) {
                result['userData'] = req.user
                res.render("rentalPage/addRental",result);
        })
    })
    router.get('/updateRental',function(req, res){
        console.log('and we print update rental request data', req)
    })
    return router;
}


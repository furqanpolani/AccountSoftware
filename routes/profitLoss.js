
"use strict"

module.exports = function(express,app, models){

    var router = express.Router();
    var rental = require('../lib/rental')(models);
    var customer = require('../lib/customer')(models);
    var movie = require('../lib/movie')(models);
    var purchase = require('../lib/purchase')(models);
    var profitLoss = require('../lib/profitLoss')(models);    
    
    router.get('/', function(req, res){
        console.log(req.body)
        profitLoss.profitLossData().then(function(profitLossData){
            profitLoss.profitLossCal(profitLossData.data).then((result) =>{
                result['userData'] = req.user
                res.render("profitLossPage/profitLossList", {'result':result});
            })            
        })    
    })
    return router;
}


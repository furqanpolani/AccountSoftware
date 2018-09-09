"use strict"

module.exports = function(router, app, models){
    var profitLossWithFilters = require('../lib/profitLossWithFilter')(models);
    var profitLoss = require('../lib/profitLoss')(models); 
    
    //get all //done
    router.get('/profitLoss', function(req, res){
        profitLoss.profitLossData(req).then(balanceSheet =>{
            profitLoss.profitLossCal(balanceSheet.data).then((filteredData) =>{
                res.status(filteredData.code).render("profitLossPage/profitLossTable", {'result':filteredData});
            })
        })
    });
    //Profit loss using date filter 
    router.post('/profitLoss/profitLossDateFilter', function(req, res){
        profitLossWithFilters.ProfitLossData(req.body).then(balanceSheet =>{
            profitLossWithFilters.profitLossCal(balanceSheet.data).then((filteredData) =>{
                res.status(filteredData.code).render("profitLossPage/profitLossTable", {'result':filteredData});
            })
        })
    })
return router; 
}

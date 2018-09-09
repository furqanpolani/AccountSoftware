"use strict"


module.exports = function(router, app, models) {
    // var Stores = require("../lib/stores")(models);
    // //var router = express.Router();
    // var Dashboard = require("../lib/dashboard")(models);

    // router.get ('/alert', function (req, res) {
    //     Dashboard.getAlert (req.user).then(data => {
    //         res.status (data.code).json (data);
    //     });
    // });

    // router.get ('/dashboard', function (req, res) {
    //     Dashboard.getDashboard (req.body).then(data => {
    //         res.status (data.code).json (data);
    //     });
    // });

    // router.get ('/getAllTicketCount', function (req, res) {
    //     Dashboard.getAllTicketCount ().then(data => {
    //         res.status (data.code).json (data);
    //     });
    // });
 
    
    router.get ('/userList',function(req,res){
        console.log('request ', req.query ); 
        models.Employees.findAll({
            where:{
                fullName : "saqib" 
            }
        })
            .then(function (employeeList){
                res.status(200).json(employeeList); 
            });
        
    });





    return router;
}

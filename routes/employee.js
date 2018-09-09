"use strict"

module.exports = function(express,app, models){

    var router = express.Router();
    var employee = require('../lib/employee')(models); 
    
    //get all //done
    router.get('/', function(req, res){
        employee.getAll().then(function(employeeResult){
            var result = {}
            console.log(employeeResult.data.dataValues);
            result['userData'] = req.user
            result['employeeResult'] = employeeResult
            
            res.render("employeePage/employeeList", {'result': result}); // changed 
        })
    });

    return router;
}

"use strict"
var md5 = require("md5");
module.exports = function(models){

    function getAll(){
       return models.Employees.findAll()
       .then(function (employeeList){
            return {status: true, code: 200, data: employeeList}
       }); 
    }
    
    function create(data){
        console.log("and the data of the created employee is : ", data)
        return new Promise((resolve, reject) =>{
            var password = md5(data.password)
            data.password = password.substring(14, password.length);
            resolve()

        }).then(() =>{
            return models.Employees.create(data).then((createdEmployees) =>{
                return {
                    status: true,
                    code: 200,
                    data: createdEmployees
                }
            }).catch((err) =>{
                return {
                    status: false,
                    code: 404,
                    data: err
                }
            })
        })
    }
    function getById(paramId){
        return models.Employees.findOne({
            where: {
                id: paramId
            }
            }).then(function (employeeData){
                return {
                    status: true,
                    code: 200, 
                    data: employeeData
                }
            });
    }
    function updateById(dataUpdate, employeeId){
        return  models.Employees.findOne({
            where: { 
                id: employeeId
            } 
            }).then(function (employee){
                
                if(employee){
                return models.Employees.update(dataUpdate, {
                        where: { 
                            id: employeeId
                        }
                        }).then(function(updatedEmployee){
                            return {
                                status: true, 
                                code: 200, 
                                data: updatedEmployee
                            }   
                        })       
                }  
            })
    }

    function deleting(employeeId){
        return models.Employees.destroy({
            where: {
                id: employeeId
            }  
            }).then(function(){
                return {
                    status: true, 
                    code: 200, 
                    data: "Deleted"
                }
            })
    }

    return {
        getAll: getAll,
        create: create,
        getById: getById,
        updateById: updateById,
        deleting: deleting
    }
}

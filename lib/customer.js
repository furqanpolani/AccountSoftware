"use strict"
module.exports = function(models){

    function getAll(){
       return models.Customers.findAll({
        include: [
            {model: models.Employees}         
        ]
       }).then(function (customersList){
            return {status: true, code: 200, data: customersList }
       }); 
    }
    
    function create(data){
        return models.Customers.create(data)
        .then(function(createdCustomers){
            return {
                status: true,
                code: 200,
                data: createdCustomers
            }
            }).catch(function(err){
            return {
                status: false,
                code: 404,
                data: err
            }
            })
    }

    function getById(paramId){
        return models.Customers.findOne({
            where: {
                id: paramId
            }
        }).then(function (customerData){
                return {
                    status: true,
                    code: 200, 
                    data: customerData
                }
            });
    }

    function getByName(paramName){ 
        console.log('\nparamName received is ', paramName)
        return models.Customers.findOne({
            where: { 
                name: paramName
            }
        }).then(function (customerData){
            console.log("\nThe customer data printed here is : ", customerData)
            return {
                status: true,
                code: 200,
                data: customerData
            }
        })
    }

    function updateById(dataUpdate ){
        
        var customerId = dataUpdate.customerId
        return models.Customers.findOne({
            where: { 
                id: customerId
            } 
            }).then(function (customer){
                
                if(customer){
                return models.Customers.update(dataUpdate, {
                        where: { 
                            id: customerId
                        }
                    }).then(function(updatedCustomer){
                        return {
                            status: true, 
                            code: 200, 
                            data: updatedCustomer
                        }   
                    })       
                }  
            })
    }

    function deleting(customerId){
        return models.Customers.destroy({
            where: {
                id: customerId
            }  
            }).then(function(){
                return {
                    status: true, 
                    code: 200, 
                    data: "Deleted"
                }
            })
    }

    function customerWithRent(customerId){
        return models.Customers.findOne({
            where: {
                id: customerId
            },
            include: [
                {model: models.Rental,
                    include: [
                       
                       
                    ]
                }         
            ]
        }).then(customer => {
            return { 
                status: true,
                code: 200,
                data: customer
            }
        })
    }

    function getAllForLookUp (){
        var list = {}
        var customerArray = []
        
        return models.Customers.findAll().then((customers) =>{
            return new Promise((resolve, reject) =>{
                customers.forEach((customer) =>{
                    var tempCustomer = {
                        value: customer.name,
                        data: customer
                    }
                    customerArray.push(tempCustomer);
                })
                resolve()
            }).then(() =>{
                        list['customerArray'] = customerArray
                        return {status:true, code: 200, data: list}  
                })   
        })
    }

    return {
        getAll: getAll,
        create: create,
        getById: getById,
        updateById: updateById,
        deleting: deleting,
        customerWithRent: customerWithRent,
        getByName: getByName,
        getAllForLookUp:getAllForLookUp
    }
}


"use strict"
module.exports = function(models){

    function getAll(){
       return models.Purchases.findAll({
          include : [
              {model: models.Employees},
              {model: models.Movies}
          ]
       })
       .then(function (PurchasesList){
            console.log(PurchasesList)    
            return {status: true, code: 200, data: PurchasesList }
        
       }); 
    }
    
    function create(data){
        var balanceFromDatabase; 
        var totalBalance;
        var dataUpdate = {}
        return models.Purchases.create(data)
        .then(function(createdPurchases){
            return models.Movies.findOne({
                where:{
                    id: data.MovieId
                }
            }).then((movie) =>{
                return new Promise((resolve, reject) =>{
                    balanceFromDatabase = movie.balance
                    totalBalance = balanceFromDatabase + parseInt(data.quantity)    
                    dataUpdate = {
                        balance: totalBalance
                    }
                    resolve()
                }).then(() =>{
                    return models.Movies.update(dataUpdate, {
                        where: { 
                            id: data.MovieId
                        }    
                    }).then(() =>{
                        console.log("i runned myself", createdPurchases)
                        return {
                            status: true,
                            code: 200,
                            data: createdPurchases
                        }            
                    }).catch(function(err){
                        return {
                            status: false,
                            code: 404,
                            data: err
                        }
                    }) 
                }) 
            })
            
        }
    )}

    function getById(paramId){
        return models.Purchases.findOne({
            where: {
                id: paramId
            }
        }).then(function (PurchasesData){
                return {
                    status: true,
                    code: 200, 
                    data: PurchasesData
                }
            });
    }
    function updateById(dataUpdate, PurchasesId){
        var movieId = dataUpdate.MovieId
        console.log('....movieID in api update from dataUpdate is : ', movieId)
        var previousQuantity
        var updatedQuantity
        var differenceQuantity
        var balanceFromDatabase
        var newBalance
        var balanceObject = {}
        var updatedDataVariable
        return  models.Purchases.findOne({
            where: { 
                id: PurchasesId
            } 
            }).then(function (Purchases){
                if(Purchases){
                console.log('Purchase Id is : ', PurchasesId)
                return models.Purchases.findOne({
                    where: {
                        id: PurchasesId
                    }
                }).then((purchase) =>{
                    if(Purchases){    
                        return new Promise ((resolve, reject) =>{
                            previousQuantity = purchase.quantity
                            resolve()
                        }).then(() =>{
                            return models.Purchases.update(dataUpdate, {
                                where: {
                                    id: PurchasesId
                                }
                            }).then((updatedPurchase) =>{
                                updatedDataVariable = updatedPurchase
                                return new Promise ((resolve, reject) =>{
                                    updatedQuantity = parseInt(dataUpdate.quantity)
                                    differenceQuantity = previousQuantity - updatedQuantity
                                    console.log('prevousQuantity is :', previousQuantity)
                                    console.log('updated QUantity is :', updatedQuantity)
                                    console.log('diffenrece Quantity is :', differenceQuantity)
                                    resolve()
                                }).then(() =>{
                                    return models.Movies.findOne({
                                        where: {
                                            id: dataUpdate.MovieId
                                        }
                                    }).then((specificMovie) =>{
                                        return new Promise((resolve, reject) =>{
                                            console.log('data update and movie ID is ', dataUpdate, dataUpdate.MovieId)
                                            balanceFromDatabase = specificMovie.balance
                                            newBalance = balanceFromDatabase - differenceQuantity
                                            balanceObject = {
                                                balance: newBalance
                                            }
                                            resolve()
                                        }).then(() =>{
                                            return models.Movies.update(balanceObject, {
                                                where: {
                                                    id: movieId
                                                }
                                            }).then(() =>{
                                                return {
                                                    status: true,
                                                    code: 200, 
                                                    data: updatedDataVariable                                                                      
                                                }

                                            })
                                        })
                                        

                                    })
                                })
                            })
                            
                        })
                    }
                })
            }   
        })
    }



    // function updateById(dataUpdate, PurchasesId){
    //     var previousQuantity;
    //     var totalQuantity;
    //     var balanceFromDatabase;
    //     var totalBalance;
    //     var movieUpdate = {}
    //     return  models.Purchases.findOne({
    //         where: { 
    //             id: PurchasesId
    //         } 
    //     }).then(function (purchases){
    //         if(purchases){
    //             previousQuantity = purchases.quantity
    //             return models.Purchases.update(dataUpdate, {
    //                 where: { 
    //                     id: PurchasesId
    //                 }
    //             }).then(function(updatedPurchases){
    //                 totalQuantity = parseInt(updatedPurchases.quantity) - previousQuantity
    //                 return models.Movies.findOne({
    //                     where: {
    //                         id: updatedPurchases.MovieId
    //                     }
    //                 }).then((movies) =>{
    //                     console.log('movies ..............movies is : ', movies, dataUpdate.MovieId)
    //                     return new Promise((resolve, reject) =>{
    //                         balanceFromDatabase = movies.balance
    //                         totalBalance = balanceFromDatabase + totalQuantity
    //                         movieUpdate = {
    //                             balance: totalBalance
    //                         }
    //                         resolve()
    //                     }).then(() =>{
    //                         return models.Movies.update(movieUpdate, {
    //                             where: {
    //                                 id: updatedPurchases.MovieId
    //                             }
    //                         }).then(() =>{
    //                             return {
    //                                 status: true, 
    //                                 code: 200, 
    //                                 data: updatedPurchases
    //                             }   

    //                         }) 
    //                     }) 
    //                 })  
    //             })       
    //         }  
    //     })
    // }

    function deleting(PurchasesId){
        return models.Purchases.destroy({
            where: {
                id: PurchasesId
            }  
            }).then(function(){
                return {
                    status: true, 
                    code: 200, 
                    data: "Deleted"
                }
            })
    }


    function getAllForLookUp (){
        var list = {}
        var movieTitle = []
        return models.Movies.findAll().then((movie) =>{
            return new Promise((resolve, reject) =>{
                movie.forEach((movies) =>{
                    var tempMovie = {
                        value: movies.title,
                        data: movies
                    }
                    movieTitle.push(tempMovie);
                })
                resolve()
            }).then(() =>{
                list['movieTitle'] = movieTitle
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
        getAllForLookUp:getAllForLookUp
    }
}

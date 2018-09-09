"use strict"
module.exports = function(models){
    function getAll(data){
        // console.log('where status ', data.query)
        console.log("the rent return status is printed ", data.query.returnStatus);
        var where = {};
        if(data.query && data.query.returnStatus){
            where.rentReturnStatus = data.query.returnStatus
        };
        return models.Rental.findAll({
            where: {
                rentReturnStatus: false
            },
            include: [
                {model: models.Employees},
                {model: models.Customers},
                {model: models.Movies}
            ]
        }).then(function (rentalList){
            return new Promise((resolve, reject) =>{
                rentalList.forEach(movie => {
                    movie['rentStatus'] = 'unpaid'
                    movie['returnStatus'] = 'notReturned'
                    if (movie.rentPaidStatus) {
                        movie.rentStatus = 'paid'
                    }
                    if (movie.rentReturnStatus) {
                        movie.returnStatus = 'Returned'
                    }
                });
                
                resolve()
            }).then(() =>{
                return {status: true, code: 200, data: rentalList }
            })
            
             
       }); 
    }
    
    /*   var rentStatus ;
            rentalList.forEach(function(item){
                if(rentalList.data.rentPaidStatus === 'true'){
                    rentStatus = 'paid'
                    return rentStatus 
                }
                else{
                    rentStatus = 'unpaid'
                    return rentStatus 
                }

       }) */
       
    
    function create(data){
        var object = {}
        var quantity = -1
        var userData = data.body
        var movieId = userData.MovieId
        var rentMovieReturnStatus = userData.rentReturnStatus
        var balanceForDatabase
        var balanceObject = {}
        if(userData.rentReturnStatus == 1 || userData.rentReturnStatus == true){
            quantity = 0
        }
        object = quantityUpdate({
                movieId: userData.MovieId,
                quantity: quantity
            })
        console.log('object is ":', object)
        return models.Rental.create(userData).then(userData =>{
            return {
                status: true,
                code: 200,
                data: userData
            }
        })
    }

    function getById(paramId){
        return models.Rental.findOne({
            where: {
                id: paramId
            }
        }).then(function (rentalData){
                return {
                    status: true,
                    code: 200, 
                    data: rentalData
                }
            });
    }
    function updateById(dataUpdate, rentalId){
        var userData = dataUpdate
        var movieId = userData.MovieId
        var updatedMovieReturnStatus = userData.rentReturnStatus
        var previousMovieReturnStatus 
        var balanceForDatabase
        var bal;
        var balanceObject = {}
        
        var balanceObject = {}
        console.log('rental id is : ', rentalId)

        return models.Rental.findOne({
            where: { 
                id: rentalId
            } 
        }).then(function (rental){
            if(rental){
                previousMovieReturnStatus = rental.rentReturnStatus
                if(previousMovieReturnStatus == updatedMovieReturnStatus){
                    console.log('..........prevouis and updated return status matched')
                    return models.Rental.update(userData, {
                        where: {
                            id: rentalId
                        }
                    }).then((updatedRental) =>{
                        return {
                            status: true, 
                            code: 200, 
                            data: updatedRental
                        } 
                    })
                }
                else if (previousMovieReturnStatus != updatedMovieReturnStatus){
                    console.log('prevouis and updated return are not matched ..........................')
                    return new Promise ((resolve, reject) =>{
                        //if previously movie was returned and now it is notReturned
                        if(previousMovieReturnStatus){
                            bal = -1
                            console.log('bal is :', bal)
                        }                    
                        // previously movie was not returned but now it is returned
                        if(updatedMovieReturnStatus){
                            bal = 1
                            console.log('bal is :',bal)
                        }
                        resolve()
                    }).then(() =>{
                        console.log('control is in movies findone function')
                        return models.Movies.findOne({
                            where: {
                                id: movieId
                            }
                        }).then((movieData) =>{
                            if(movieData){
                                return new Promise ((resolve, reject) =>{
                                    balanceForDatabase = movieData.balance + bal 
                                    balanceObject = {
                                        balance: balanceForDatabase
                                    }
                                    console.log('balance object is:', balanceObject)
                                    resolve()
                                }).then(() =>{
                                    return models.Movies.update(balanceObject, {
                                        where: {
                                            id: movieId
                                        }
                                    }).then(() =>{
                                        return models.Rental.update(userData, {
                                            where: {
                                                id: rentalId
                                            }
                                        }).then((updatedRental) =>{
                                            console.log('update Rental is created!')
                                            return {
                                                status: true,
                                                code: 200,
                                                data: updatedRental
                                            }
                                        }).catch((err) =>{
                                            return {
                                                status: false,
                                                code: 404,
                                                data: err
                                            }
                                        })
                                    })
                                })
                            }
                        })
                    })    
                }             
            }  
        })
    }

    function deleting(rentalId){
        return models.Rental.destroy({
            where: {
                id: rentalId
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
        var customerName = []
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
                return models.Customers.findAll().then((customerData) =>{
                    return new Promise ((resolve, reject) =>{
                        customerData.forEach((customers) =>{
                            var tempCustomers = {
                                value: customers.name,
                                data: customers
                            }
                            customerName.push(tempCustomers);
                        })
                        resolve()
                    }).then(() =>{
                        list['movieTitle'] = movieTitle
                        list['customerName'] = customerName
                        return {status:true, code: 200, data: list}  
                    })      
                })  
            })
        })
    }

    // obj = {
    //     movieId: <movieId>,
    //     quantity: <number>
    // }
    
    function quantityUpdate (obj) {
        console.log('obj js :', obj)
        return models.Movies.findOne({
            where: {
                id: obj.movieId
            }
        }).then( movie =>{
            if(movie){
                return models.Movies.update({balance: obj.quantity + movie.balance}, {
                    where: {
                        id: obj.movieId
                    }
                }).then(updatedMovie =>{
                    return {
                        status: true,
                        code: 200,
                        data:updatedMovie
                    }
                })
            }else if(movie.balance <= 0){
                return {
                    status: false,
                    code: 404,
                    data: "Out of Stock"
                }
            }
            else{
                return {
                    status: false,
                    code: 404,
                    data:'Movie not Found'
                }
            }
        })

    }

    // function quantityUpdate (userData, rentalId){
    //     var movieId = userData.MovieId
    //     var rentMovieReturnStatus = userData.rentReturnStatus
    //     var balanceFromDatabase
    //     var balanceForDatabase
    //     var updatedBalance
    //     var completeMovie
    //     //for updating 
    //     var updatedMovieReturnStatus = userData.rentReturnStatus
    //     var previousMovieReturnStatus  
    //     var bal
    //     var balanceObject = {}
    //     return models.Movies.findOne({
    //         where: {
    //             id: movieId
    //         }
    //     }).then((movieData) =>{
    //         completeMovie = movieData
    //         if(movieData){
    //             balanceFromDatabase = movieData.balance
    //         }
    //         return models.Rental.findOne({
    //             where: {
    //                 id: rentalId
    //             }
    //         }).then((rentalData) =>{
    //             if(rentalData){
    //                 previousMovieReturnStatus = rentalData.rentReturnStatus  
    //                 if(previousMovieReturnStatus == updatedMovieReturnStatus){
    //                     console.log('..........prevouis and updated return status matched')
    //                     balanceObject = {
    //                         balance: balanceFromDatabase
    //                     }
    //                 } 
    //                 else if (previousMovieReturnStatus != updatedMovieReturnStatus){
    //                     console.log('prevouis and updated return are not matched ..........................')
                        
    //                     //if previously movie was returned and now it is notReturned
    //                     if(previousMovieReturnStatus){
    //                         bal = -1
    //                         console.log('bal is :', bal)
    //                     }                    
    //                     // previously movie was not returned but now it is returned
    //                     if(updatedMovieReturnStatus){
    //                         bal = 1
    //                         console.log('bal is :',bal)
    //                     }
    //                     updatedBalance = completeMovie.balance + bal 
    //                     if(updatedBalance<0){
    //                         return 0
    //                     }
                        
    //                     balanceObject = {
    //                         balance: updatedBalance
    //                     }
    //                     return balanceObject                  
                        
    //                 } 
    //             } 
    //             else {
    //                 if(rentMovieReturnStatus){
    //                     balanceForDatabase = movieData.balance -1
                        
    //                 }
    //             }
    //         })
    //     })
    // }

    return {
        getAll: getAll,
        create: create,
        getById: getById,
        updateById: updateById,
        deleting: deleting,
        getAllForLookUp:getAllForLookUp,
        quantityUpdate: quantityUpdate
    }
}

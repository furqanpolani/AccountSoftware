"use strict"

module.exports = function(models){
    //getting all data for balance sheet
    async function profitLossData(data){
        var movieArray = []
        let movies = await models.Movies.findAll().then(movies =>{
            return movies
        })
        let costAndQuan = await costAndQuantity(movies)
        let sellingData = await rentData(movies)
        let arrangedData = await arrangingData(costAndQuan,sellingData,movies)
        return {
            status: true,
            code: 200,
            data: arrangedData
        }
    }
//finds cost and the quantity with respect to movie
    function costAndQuantity(movies){
        var movieArray = []
        return new Promise ((resolve,reject) =>{
            movies.forEach((movie,index) => {
                var costing = 0
                var quan = 0
                var movie
                return models.Purchases.findAll({
                    where: {
                        MovieId: movie.id
                    },
                    include:[
                        {model: models.Movies}
                    ]
                }).then(purchases =>{
                    return new Promise((res, reject) =>{
                        purchases.forEach(purchase =>{
                            costing = costing + purchase.cost
                            quan = quan + purchase.quantity
                        })
                        res()
                    }).then(() =>{
                        movieArray[index]= {cost: costing, quantity: quan, movieId: movie.id, movieData: movie}
                        if((movies.length - index ) == 1){
                            resolve()
                        }
                    })    
                })
            })
        }).then(() =>{
            return movieArray    
        })
    }
//finds rent amount  with respect to paid status 
    function rentData(movies){
        var movieArray = []
        return new Promise ((resolve, reject) =>{
            movies.forEach((movie, index) =>{
                var totalRentAmount = 0
                return models.Rental.findAll({
                    where: {
                        rentPaidStatus: 1,
                        MovieId: movie.id
                        // if(){
                        //     updatedAt: {$gte: startRange, $lte: endRange}
                        // }
                     
                    }
                }).then((rentals) =>{
                    return new Promise ((res, rej) =>{
                        rentals.forEach((rental) =>{
                            totalRentAmount = totalRentAmount + rental.rentAmount
                        })
                        res()
                    }).then(() =>{
                        movieArray.push({rentAmount: totalRentAmount, movieId: movie.id})
                        if((movies.length - index) == 1){
                            resolve()
                        }
                    })
                })
            })
        }).then(() =>{
            return movieArray
        })
    }
    //arranging data by making an array of required data
    function arrangingData(costAndQuan,sellingData,movies){
        var array = []
        for (var i=0; i< movies.length; i++){
            array[i] = {
                costing: costAndQuan[i].cost,
                quantity: costAndQuan[i].quantity,
                movieId: costAndQuan[i].movieId,
                totalRentAmount: sellingData[i].rentAmount,
                movieData: costAndQuan[i].movieData
            }
        }
        return array
    }
   //calculating profit Loss for specific movie
    function profitLossCal(balanceSheet){
        return new Promise ((resolve, reject) =>{
            return new Promise((res, reject) =>{
                balanceSheet.forEach((bal, index) =>{
                    var profit = bal.totalRentAmount - bal.costing
                    bal["profitLoss" ] = profit
                    if((balanceSheet.length - index) == 1){
                        res()
                    }
                })
            }).then(() =>{
                resolve({
                    status: true,
                    code: 200,
                    data: balanceSheet
                })
            })    
        })
    }
    return {
        profitLossData: profitLossData,
        costAndQuantity: costAndQuantity,
        rentData: rentData,
        arrangingData: arrangingData,
        profitLossCal:profitLossCal
    }
}




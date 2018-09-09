"use strict"
module.exports = function(models){
    
    function getAll(){
       return models.Movies.findAll()
       .then(function (movieList){
          return {status: true, code: 200, data: movieList }
       }); 
    }
    
    function create(data){
        return models.Movies.create(data)
        .then(function(createdMovies){
            return {
                status: true,
                code: 200,
                data: createdMovies
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
        return models.Movies.findOne({
            where: {
                id: paramId
            }
        }).then(function (movieData){
                return {
                    status: true,
                    code: 200, 
                    data: movieData
                }
            });
    }
    function updateById(dataUpdate, movieId){
        return models.Movies.findOne({
            where: { 
                id: movieId
            } 
            }).then(function (movie){
                
                if(movie){
                return  models.Movies.update(dataUpdate, {
                        where: { 
                            id: movieId
                        }
                        }).then(function(updatedMovie){
                            return {
                                status: true, 
                                code: 200, 
                                data: updatedMovie
                            }   
                        })       
                }  
            })
    }

    function deleting(movieId){
        return models.Movies.destroy({
            where: {
                id: movieId
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

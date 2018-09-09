"use strict"


module.exports = function(config,data) {

    var databases = data;


    databases[config.database] = databases[config.database] || require('../models/cspModels')(databases,config);
    //console.log('Connection has been established succesfully with ' , config.database );
    /*if (!databases[config.databaseName]){
      var NewDatabase = require('../models')(databases,config);
    }*/


}

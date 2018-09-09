"use strict"

module.exports = function(express,app, models){

    var router = express.Router();
    // var Activity = require('../../lib/public/activity')(models);


    // router.get('/:id/:typeID', function(req, res) {
    //     req.body.id = req.params.id;
    //     req.body.typeID = req.params.typeID;
    //     Activity.getActivityById(req.body).then(data =>{
    //         var dataResult = {
    //                 activity: data,
    //                 userData: req.user,
    //             }

    //             //Stores.getStoreById(req.body.id).then(store => {
    //             //    dataResult['store'] = store;
    //                 //res.json(dataResult);
    //                 res.render("list/activity", dataResult);
    //             //});

    //     });
    // });



    return router;
}

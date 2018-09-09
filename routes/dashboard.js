
"use strict"

module.exports = function(express,app, models){

    var router = express.Router();

    //var result = require('../response.json');

    router.get('/', function(req, res, next) {
        var result = {}
        var userData = {userData: req.user}
        //console.log("userData ", userData);
        result['userData'] = userData
        res.render("pages/dashboard",{'result': result});
    });

    return router;
}

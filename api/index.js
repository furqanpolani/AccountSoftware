

module.exports = function(app) {
    //Get passport from app in order to deserialized user
    var passport =  app.get('passport')
    var models = require("../models");
    var express =  require('express')
var router = express.Router();
    //Root test the api and provides api token
    router.route('/')
    .get(function(req, res, next) {
      res.send({"Hello":"world"});
    })
    .post(function(req,res, next){
        passport.authenticate('local-api-token',{session:false},function(err,token){
            console.log("new Signin");
            res.send({token:token});
        })(req, res);

    });

    //check if tocken is valid
    router.all('*',require('../middleware/checkToken'))

    //load all api routes
    var fs = require("fs");
    fs
      .readdirSync(__dirname)
      .filter(function(file) {
        return(file.indexOf(".") !== 0) &&(file !== "index.js");
      })
      .forEach(function(file) {
          //console.log('file name ', file);
          var routerReturn = require("./" + file)(router,app,models);
          router.use('/' + file, routerReturn);
          //router.route('/' + file)
      });

    //catch all routes not found
    router.all('*',function(req,res,next){
        res.sendStatus(404);
    })



      return router;
}

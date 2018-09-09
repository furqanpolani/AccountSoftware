"use strict"
var jwt = require('jsonwebtoken');
var Config = require('../config/billingConfig/config.js');
var config = new Config();


module.exports = function(req, res, next) {
    var test =  req.isAuthenticated();
     if(req.isAuthenticated()){
         console.log('control in customerAuth.......\n')
         jwt.verify(req.user,config.secret,function(err,user){
             console.log("user Data in customer ", req.user);
             if(!err){
                 var userData = {
                     userID: user.user.userID,
                     fullName: user.user.fullName,
                     loginEmail: user.user.loginEmail,
                     accountTypeID: user.user.accountTypeID,
                     userRights: user.user.userRights,
                     imageUrl: user.user.imageUrl
                 };
                 req.userData = userData;
             }
         });

         console.log('req.user.accountTypeID ', req.user.accountTypeID);
         /*if(req.user.accountTypeID != 7){
            res.redirect('/');
         }else{
             next();
         }*/

         next();

      }else{
         res.render('../views/customerPages/login')
      }

}

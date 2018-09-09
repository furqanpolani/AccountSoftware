"use strict"
var jwt = require('jsonwebtoken');
var Config = require('../config/config.js');
var config = new Config();


module.exports = function(req, res, next) {
     if(req.isAuthenticated()){
        //  console.log(' the user in authentication is : ', req.user)
         jwt.verify(req.user,config.secret,function(err,user){
             req.user.userType = 'employee';
            //  console.log('user in authentication is :', user, err)

             if(!err){

                 var userData = {
                     userID: user.userID,
                     fullName: user.user.fullName,
                     loginEmail: user.user.loginEmail,
                     accountTypeID: user.user.accountTypeID,
                     userRights: user.user.userRights,
                     imageUrl: user.user.imageUrl,
                     userType: 'employee'
                 };

                 req.userData = userData;
                 //req.body['userID'] = user.user.userID;
                 //req.body['fullName'] = user.user.userName;
              // console.log("in auth ", req.userData);
             }
         });

         //if customer is trying to access employee page then reject req
         if(req.user.accountTypeID !=7){

            next();
         }else{

             res.redirect('/customer/dashboard');
         }

      }else{
         res.render('pages/login')
      }

}

var jwt  = require('jsonwebtoken');
var Config = require('../config/config.js');
var config = new Config();

var checkToken = function(req,res,next){
    //console.log("checking token");
  //Check if token from session
  if(req.session.passport != undefined){
      jwt.verify(req.session.passport.user,config.secret,
          function(err,user){
              if(err){
                  res.status(401).json({status: false, code:401, data: err.message});
              }else{
                  req.body['userID'] = user.user.userID
                  req.body['fullName'] = user.user.fullName
                  return next();
              }
          }
      );
  }else{
      //Request came from non-session
      
      jwt.verify(req.headers.token,config.secret,function(err,user){
          // console.log('req.headers ', req.headers.token);
              if(err){
                  //console.log(err);
                  res.status(401).json({status: false, code:401, data: err.message});
              }else{
                  console.log("user here ",user);
                  req.body['userID'] = user.userID
                  req.body['fullName'] = user.fullName
                  //console.log(3);
                  return next();
              }
          }
      );
  }
  }

  module.exports = checkToken

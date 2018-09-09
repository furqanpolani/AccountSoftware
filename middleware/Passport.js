// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
var Config = require('../config/config.js');
var config = new Config();
const package = require('../package.json');




// load the auth variables
//var configAuth = require('./auth'); // use this one for testing

module.exports = function (passport,app) {
    
    var models = require("../models");
    // load up the user model
   

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session

    passport.serializeUser(function (user, done) {
        console.log("signin")
        token = jwt.sign({ 'user': user }, config.secret, { expiresIn: '24h' })
        //console.log('Token given to user '+ user.userName);
        //console.log('token: ' + token);
        done(null, token);
    });

    // used to deserialize the user
    passport.deserializeUser(function (token, done) {
        //console.log('Trying to deserialize the user using token..... ');
        jwt.verify(token,config.secret,function(err,user){
            if(err){
                console.log('Something wrong with verifing token.');
                return done(null,false);
            }else{
                if(user.user.accountTypeID != 7){
                    var newUser = {
                        userID: user.user.userID,
                        fullName: user.user.fullName,
                        loginEmail: user.user.loginEmail,
                        accountTypeID: user.user.accountTypeID,
                        userRights: user.user.userRights,
                        imageUrl: user.user.imageUrl,
                        giveCommission: user.user.giveCommission,
                        version: package.version
                    }
                }else{
                    var newUser = user.user;
                }


                //app.set("user" : user);
                //console.log('Good Token used.' , newUser);
                return done(null,newUser);
            }
        });

    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        session: false
    },
    function (req, email, password, done) {

        // asynchronous
        process.nextTick(function () {
          return models.Employees.findOne({
               where: {
                    emailAddress : email
                    }
             }).then(function (user) {
                //  console.log('the user is : ', user )
                // console.log("we are checking user " , user);
                
                // console.log('request .user is  :', req.user)
                // if no user is found, return the message
                // console.log('user is :', user)
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                    console.log(password);
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else{
                    // console.log("user in passport is \n\n\n\n:", user)
                    req.USER = user
                    return done(null, user);
                }

            }).error(function (err) {
               return done(err);
            });
        });

    }));

    // =========================================================================
    // LOCAL Customer LOGIN =============================================================
    // =========================================================================
    passport.use('local-customer-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        session: false
    },
    function (req, email, password, done) {

        // asynchronous
        process.nextTick(function () {
          return Organization.findOne({
               where: {
                    loginEmail : email
                    }
             }).then(function (user) {
                //console.log("we are checking user " , user);
                // if no user is found, return the message
                if (!user){
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                console.log('customer password ', user.validPassword(password))
                if (!user.validPassword(password)){
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }else{
                    var newUser = {
                        organizationID: user.organizationID,
                        organizationName: user.organizationName,
                        fullName: user.ownerName,
                        primaryPhone: user.primaryPhone,
                        primaryEmail: user.primaryEmail,
                        loginEmail: user.loginEmail,
                        accountTypeID: user.accountTypeID,
                        userRights: user.userRights,
                        giveCommission: user.giveCommission,
                        userID: 1,
                        version: package.version
                    }

                    return done(null, newUser);
                }

            }).error(function (err) {
               return done(err);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'loginEmail',
        passwordField : 'loginPassword',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, email, password, done) {
        console.log(req);
        // asynchronous
        process.nextTick(function () {

            //  Whether we're signing up or connecting an account, we'll need
            //  to know if the email address is in use.
            User.findOne({ 'local.loginEmail': email }, function (err, existingUser) {

                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if there's already a user with that email
                if (existingUser)
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

                //  If we're logged in, we're connecting a new local account.
                if (req.user) {
                    var user = req.user;
                    user.local.email = email;
                    user.local.password = user.generateHash(password);
                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
                //  We're not logged in, so we're creating a brand new user.
                else {
                    // create the user
                    var newUser = new User();

                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    // =========================================================================
    // LOCAL API AUTH =============================================================
    // =========================================================================
    passport.use('local-api-token', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        session: false
    },
    function (req, username, password, done) {

        // asynchronous
        console.log("second open phase");
        process.nextTick(function () {
          return models.ApiUsers.findOne({
               where: {
                   'username' : username,
                   'isActive' : 1
                }
            })
            .then(function (user) {
                // if no user is found, return the message
                if (!user){
                    return done(null, false);
                }
                if (!user.validPassword(password))
                    return done(null, false);

                // all is well, return user
                else{
                    token = jwt.sign({ 'userName': username,'apiUserID':user.apiUserId }, config.secret, { expiresIn: '24h' });
                    return done(null, token);
                }

            }).error(function (err) {
               return done(err);
            });
        });

    }));


}

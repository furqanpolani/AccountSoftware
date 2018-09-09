"use strict"
var md5 = require("md5");
var moment = require("moment");

module.exports = function(models) {
    var invoice = require('./invoice')(models);

    function getUserById(data){

        return models.User.findOne({
            where:{
                userID: data.userId,
                isActive: true
            }
        }).then(user =>{
            return {status:true, code:200 , data:user}
        }).catch(err =>{
            return {status: false, code: 500, data: err.message, error: err}
        });
    }

    function getUserDetailById(data){
        var userData = {
            user: null,
            accountType: null,
            userRights:null
        };

        return models.User.findOne({
            where:{
                userID: data.userId,
                isActive: true
            },
            
        }).then(user =>{
            userData.user = {status:true, code:200 , data:user}
        }).then(()=>{
            return models.AccountType.findAll()
            .then(accountType=>{
                userData.accountType = {status: true, code:200, data:accountType}
           });


        }).then(() =>{

            return models.UserRightCatalog.findAll()
            .then(userRight=>{
                userData.userRights =  {status:true, code:200, data:userRight};
            });
        })



        .then(() =>{
            return {status: true, code: 200, data: userData};
        }).catch(err =>{
            return {status: false, code: 500, data: err.message, error: err}
        });
    }

    function getAll(data){
        return models.User.findAll({
            where:{
                isActive: true
            },
            order:[
                ['fullName']
            ]
        }).then(user =>{

            return {status: true, code: 200, data: user};
        }).catch(err =>{
            return {status: false, code: 500, data: err.message, error: err}
        });
    }

    function getAllList(data){
        
        var userData = {
            users: null,
            accountType: null,
            userRights:null
        };

        return models.User.findAll({
            where:{
                isActive: true
            },
            order:[
                ['fullName']
            ]
        }).then(user =>{
            userData.users = {status:true, code:200 , data:user}
        }).then(()=>{
            return models.AccountType.findAll()
            .then(accountType=>{
                userData.accountType = {status: true, code:200, data:accountType}
           });


        }).then(() =>{

            return models.UserRightCatalog.findAll()
            .then(userRight=>{
                userData.userRights =  {status:true, code:200, data:userRight};
            });
        })



        .then(() =>{
            return {status: true, code: 200, data: userData};
        }).catch(err =>{
            return {status: false, code: 500, data: err.message, error: err}
        });
    }

    function add(data,callback){
        models.User.findOne({
            where:{
                loginEmail: data.loginEmail
            }
        }).then(user =>{
            if(user){
                callback({status:false, code:404, data: "email already exists"});
                return;
            }else{
                /*console.log(data);
                var pass = md5(data.loginpassword);
        		var m5pass = pass.substring(14, pass.length);
                data.password = m5pass*/
                uimage({
                    id: new Date().getTime(),
                    image: data.image
                }).then(awsres => {
                    console.log("about to update")
                    console.log(awsres);
                    data.imageUrl = (awsres ? awsres.Location : null);
                models.User.create(data)
                    .then(newUser =>{
                        callback({status: true, code:201, data: newUser});
                    }).catch(err =>{
                        console.log("sfdsdfdsf")
                        console.log(err);
                        callback({status:false, code:400, data: err.message , error:err});
                        return;
                    });
                });
            }
        }).catch(err =>{
            console.log(err);
            callback({status:false, code:400, data: err.message , error:err});
            return;
        });
    }

    function update(data,callback){

        var newData = {
          fullName: data.fullNameInput,
          loginEmail: data.loginEmail,
          address: data.address,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          phoneNumber: data.phoneNumber,
          alternativeEmail: data.alternativeEmail,
          accountTypeID: data.accountTypeID,
          userRights: data.userRights,
          isActive: data.isActive,
          imageUrl: data.imageUrl
        }

        models.User.findOne({
            where:{
                userID: data.id
            }
        }).then(user =>{

            if(data.loginPassword){
                var pass = md5(data.loginPassword);
                var m5pass = pass.substring(14, pass.length);
                data.loginPassword = m5pass
            }

            return uimage({
                id: new Date().getTime(),
                image: data.imageUrl
            }).then(awsres => {
                    //console.log('saqibimageURL ', awsres)
                    newData.imageUrl = (awsres ? awsres.Location : null);

                    console.log("user Data ", newData);

                if(data.loginEmail && user.loginEmail != data.loginEmail){
                    models.User.findOne({
                        where:{
                            loginEmail: data.loginEmail
                        }
                    }).then(checkingEmail =>{
                        if(checkingEmail){
                            callback({status:false, code:404, data:"Email address already exists"});
                            return;
                        }else{
                            /*data.fullName = data.userName;
                            console.log("new data ", data)*/
                            models.User.update(newData,{
                                where: {
                                    userID: data.id
                                }
                            }).then(updatedUser =>{
                                    callback({status: true, code:201, data: updatedUser});
                                    return;
                                }).catch(err =>{
                                    console.log(err);
                                    callback({status:false, code:400, data: err.message , error:err});
                                    return;
                                    });
                        }
                    });
                }else{
                    /*data.fullName = data.userName;*/
                    //console.log("new data here", data)
                    models.User.update(newData,{
                        where: {
                            userID: data.id
                        }
                    }).then(updatedUser =>{
                        callback({status: true, code:201, data: updatedUser});
                        return;
                    }).catch(err =>{
                        console.log(err);
                        callback({status:false, code:400, data: err.message , error:err});
                        return;
                    });
                }
            });

        }).catch(err =>{
            console.log(err);
            callback({status:false, code:400, data: err.message , error:err});
            return;
        });
    }

    function uploadImage(data){

        return uimage({
            id: new Date().getTime(),
            image: data.image
        }).then(awsres => {
            console.log('saqib0001 ', awsres);
            //data.imageUrl = (awsres ? awsres.Location : null);
            /*return models.User.update({
                imageUrl: data.imageUrl
            },{
                where: {
                    userID : data.id
                }
            }).then (updated => {
                return {status: true, code: 200, data: data}
            }).catch(err => {
                return {status: false, code: 500, data: err.message, error: err}
            })*/
            return {status: true, code: 200, data: awsres}
        }).catch(err => {
            console.log(err);
            return {status: false, code: 500, data: err.message, error: err}
        });
    }

    function uimage(data){
        var AWS = require ("aws-sdk");
        var validator = require("validator");
        AWS.config.update ({
        	accessKeyId: "AKIAJWNYIWU7D6Q5JNUQ", secretAccessKey: "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"
        });

        var s3Bucket = new AWS.S3 ();
        var route53 = new AWS.Route53 ();

                var promise = new Promise(function(resolve, reject){

        			if (data.image){
        				if(validator.isUrl(data.image)){
        					resolve({Location: data.image});
        				}
        				s3Bucket.upload ({
                            Bucket: "posuserdata-production",
            				Key: "billing-" + data.id + ".png",
        					Body: new Buffer (data.image.replace (/^data:image\/\w+;base64,/, ""), "base64"),
        					ContentEncoding: 'base64'
        				}, function (err, location){
        					console.log (err);
        					if (err){
        						reject(err);
        					}else{
        						console.log ("sending", location);
        						resolve(location);
        					}
        				});
        			}else{
        				resolve(true)
        			}

                });

                return promise;
    }

    function deleteUser(data,callback){
        models.User.destroy({
        where: {
            userID: data.id
        }
        }).then(function(deleted){
            Activity.addActivity({ fromId: data.id, activity: "deleted Users.", userID: data.userID, userName: data.fullName, typeId: 1, status: 'delete',data:"User  #"+ data.id+" Has Been Deleted"});
                callback({status: true, code: 200, data: "User deleted Successfully."});
        }).catch(function(err){
                callback({status: false, code: 500, data: "Failed to delete User."});
        });
    }

    return {
        getUserById: getUserById,
        getAll: getAll,
        uploadImage: uploadImage,
        getAllList: getAllList,
        update: update,
        add: add,
        delete: deleteUser,
        getUserDetailById: getUserDetailById
    };
}

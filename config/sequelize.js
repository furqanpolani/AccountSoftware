var Sequelize = require('sequelize');
var Config = require('./config.js');
var config = new Config();


//console.log(config);

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: "mysql",
    port: 3306,
    logging: true
});

sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established succesfully with' , config.database)
    }, function(err) {
        console.log('Unable to connect to the database', err);
    });
    

 sequelize
    //  .sync({force: false})
    //  .then(function(err) {
    //      console.log('It worked!')
    //      const models = require('../models')
    //     let user = {
    //          apiType: 'web',
    //          username: 'furqan',
    //          password: 'password' 
    //      } 
 
    //     models.ApiUsers.create(user)
    //         .then (user => {
    //             console.log('user created!')
    //         }); 
        //updated
        // .sync({force: false})
        // .then(function(err) {
        //  console.log('It worked!')
        //  const models = require('../models')
        //     let user = {
        //         name: 'furqan',
        //         emailAddress: 'furqan.polani11@gmail.com',
        //         password: 'password' 
        //     } 
 
        // models.Employees.create(user)
        // .then (user => {
        //     console.log('user created!')
        // }); 
         
        //     let employee = {
        //     name: 'Saqib Raifq',
        //     password: 'password',
        //     address: '1989 Unvierstiy Ave Bronx NY',
        //     emailAddress: 'saqib@cellsmartpos.com',
        //     phoneNumber: '9175297186'
        // };

   
        // let employee = { 
        //     fullName: 'Furqan Polani',
        //     password: 'furqan123',
        //     address: 'Karachi Pakistan', 
        //     emailAddress: 'furqan.polani11@gmail.com',
        //     phoneNumber: '123456789'
        // };


    //   }) 

module.exports = sequelize;

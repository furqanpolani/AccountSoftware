"use strict"
var md5 = require("md5");
module.exports = function(sequelize, DataTypes) {

    var Employees = sequelize.define("Employees", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT
        },
        emailAddress: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        position: {
            type: DataTypes.STRING(50)
        },
        salary: {
            type: DataTypes.DECIMAL(10,2)
        },
        phoneNumber: {
            type: DataTypes.STRING(50)
        },
        city: {
            type: DataTypes.STRING(50)
        },
        state: {
            type: DataTypes.STRING(50)
        },
        postalCode: {
            type: DataTypes.STRING(50)
        }
    }, {
        paranoid: true,
        classMethods: {
            associate: function(models) {
                Employees.hasMany(models.Customers, {allowNull: false, notEmpty: true}),
                Employees.hasMany(models.Vendors, {allowNull: false, notEmpty: true}),
                Employees.hasMany(models.Sells, {allowNull: false, notEmpty: true}),
                Employees.hasMany(models.Purchases, {allowNull: false, notEmpty: true})
            }  
        },
        instanceMethods: {
            // generateHash: function(password) {
            //     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            // },
            validPassword: function(password) {
                var pass = md5(password)
                // pass.substring(14, pass.length);
                var m5pass = pass.substring(14, pass.length);
                console.log("the user entered password is :", m5pass)

                // var dataBasePass = md5(this.password)
                // pass.substring(14, pass.length);
                // var database = dataBasePass.substring(14, dataBasePass.length);
                console.log("the database password is :",this.password)
                

                // var loginPassword = md5(this.password)
                // var m5loginPass = loginPassword.substring(14, loginPassword.length)
                //console.log("password in database ",this.loginPassword);
                //console.log("password you enterd ",m5pass);

                //return true
                // console.log('login password is :', database)
                return m5pass == this.password;
            }
    
    }
    });
    return Employees;
};


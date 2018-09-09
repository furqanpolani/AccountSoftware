"use strict"
module.exports = function(sequelize, DataTypes) {

    var Vendors = sequelize.define("Vendors", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            notEmpty: true
        },
        address: {
            type: DataTypes.TEXT
            
        },
        emailAddress: {
            type: DataTypes.STRING(100)
        },
        phoneNumber: {
            type: DataTypes.STRING(50),
            notEmpty: true 
        },
        city: {
            type: DataTypes.STRING(50)
        },
        state: {
            type: DataTypes.STRING(50)
            
        },
        postalCode: {
            type: DataTypes.STRING(50)
        },
        dob: {
            type: DataTypes.DATE
        },
        referenceId: {
            type: DataTypes.INTEGER(11)
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },
        TotalInvested: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        }
    }, {
        paranoid: true,
        classMethods: {
            associate: function(models) {
                Vendors.belongsTo(models.Employees, {allowNull:false, notEmpty: true})
                Vendors.hasMany(models.Purchases, {allowNull: false, notEmpty: true})
            }       
        }
    });
    return Vendors;
};


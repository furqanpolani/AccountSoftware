"use strict"

module.exports = function(sequelize, DataTypes) {

    var Purchases = sequelize.define("Purchases", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        cost: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        quantity: {   
            type: DataTypes.INTEGER(11),
            defaultValue:0,
            allowNull: false
        },
        paidStatus: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
            notEmpty: true 
        },
        paidAmount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        paranoid: true,
        classMethods: {
            associate: function(models) {
                Purchases.belongsTo(models.Employees, {allowNull:false, notEmpty: true}),
                Purchases.belongsTo(models.Vendors),
                Purchases.belongsTo(models.Products, {allowNull: false, notEmpty: true})
			}
        }
    });
    return Purchases;
};


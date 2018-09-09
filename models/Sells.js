"use strict"

module.exports = function(sequelize, DataTypes) {

    var Sells = sequelize.define("Sells", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        sellAmount: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        paidStatus: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
            notEmpty: true 
        },
        paidAmount: {
            type: DataTypes.DECIMAL(10,2)
        },
        remainingAmount: {
            type: DataTypes.DECIMAL(10,2)
        },
        description: {
            type: DataTypes.TEXT
        }
        
        
    }, {
        paranoid: true,
        classMethods: {
            associate: function(models) {
                Sells.belongsTo(models.Employees, {allowNull:false}),
                Sells.belongsTo(models.Products, {allowNull:false}),
                Sells.belongsTo(models.Customers)
			}
        }
    });
    return Sells;
};
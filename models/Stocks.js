"use strict"
module.exports = function(sequelize, DataTypes) {

    var Stocks = sequelize.define("Stocks", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        TotalquantityPurchased: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },
        inStock: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },
    }, {
        paranoid: true,
        classMethods: {
            associate: function(models) {
                Stocks.belongsTo(models.Products, {allowNull: false, notEmpty: true})
            }       
        }
    });
    return Stocks;
};


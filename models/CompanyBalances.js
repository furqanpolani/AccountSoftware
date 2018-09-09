"use strict"
module.exports = function(sequelize, DataTypes) {

    var CompanyBalances = sequelize.define("CompanyBalances", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        balance: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0
        },
        TotalInvestment: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0
        }
    }, {
        paranoid: true,
        classMethods: { 
            associate: function(models) {
                CompanyBalances.belongsTo(models.Employees, {allowNull: false, notEmpty: true})
            }   
        }
    });
    return CompanyBalances;
};

